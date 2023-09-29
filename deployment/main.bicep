param location string = resourceGroup().location
param secondLocation string
param existingResourceGroupName string
param existingApplicationInsightsName string
param environmentName string
param containerImage string
param appport string
param dbname string
param dialect string
param host string
param keyVaultName string
param minContainerReplicas int
param maxContainerReplicas int
param containerCpu string
param containerMemory string
param containerScalseConcurrentRequests string

var serviceUniqueName='gamification'
var containerAppEnvironmentName = 'guardianlite-${environmentName}-env'
var ServiceName = '${serviceUniqueName}-${environmentName}'
var containerRegistry = 'guardianlite${environmentName}acr'

var appInsightsName = length(existingApplicationInsightsName) == 0 ? 'guardianlite-${environmentName}-ai' : existingApplicationInsightsName
resource appInsights 'Microsoft.Insights/components@2020-02-02' existing = {
  name: appInsightsName
}

output aiInstrumentationKey string = appInsights.properties.InstrumentationKey

// Gamification Service
module gamificationService 'container-http.bicep' = {
  name: ServiceName
  params: {
    enableIngress: true
    isExternalIngress: true
    location: length(secondLocation) == 0 ? location : secondLocation
    environmentName: containerAppEnvironmentName
    containerImage: '${containerRegistry}.azurecr.io/${containerImage}'
    containerAppName: ServiceName
    enableDapr: true
    containerPort: int(appport)
    minReplicas: minContainerReplicas
    maxReplicas: maxContainerReplicas
    containerCpu: containerCpu
    containerMemory: containerMemory
    containerScalseConcurrentRequests: containerScalseConcurrentRequests
    containerRegistry: containerRegistry
    containerRegistryRG: resourceGroup().name
    env: [
      { name: 'ASPNETCORE_ENVIRONMENT', value: environmentName == 'prod' ? 'Prod' : environmentName == 'dev' ? 'Testing' : 'Staging' }
      { name: 'KeyVaultName', value: keyVaultName}
      { name: 'port', value: appport}
      { name: 'host', value: host }
      { name: 'database', value: dbname }
      { name: 'dialect', value: dialect }
      { name: 'APPINSIGHTS_INSTRUMENTATIONKEY', value: appInsights.properties.InstrumentationKey }
      { name: 'DAPR_HTTP_PORT', value: '3500' }
      { name: 'DAPR_API_TOKEN', value: 'hltRQXJse2gZleBfAW6GRxh8JRFlakDKDXxOAuwOe9slNBGmieSBPO7K+GPlHggD8RY6/A778jxLurHbr8ENCA==' }
    ]
  }
}

// Add Gamification Service to API Management
module apimGamification 'api-management-api.bicep' = {
  name: 'apim-${ServiceName}'
  params: {
    apimName: 'guardianlite-${environmentName == 'prod' ? 'production' : environmentName == 'dev' ? 'develop' : 'stage'}-apimng'
    apiName: serviceUniqueName
    apiUrl: 'https://${gamificationService.outputs.fqdn}'
    apiPath: serviceUniqueName
    apiResourceId: gamificationService.outputs.resourceId
  }
}

module accessContainer2KeyVault 'keyvault-access-policy.bicep' = {
  name: 'access-${ServiceName}-2-keyVault-deployment'
  scope: resourceGroup(existingResourceGroupName)
  params: {
    keyVaultName: keyVaultName
    servicePrincipalId: gamificationService.outputs.principalId
  }
}
