param containerAppName string
param location string
param environmentName string
param containerImage string
param containerPort int
param isExternalIngress bool
param containerRegistry string
param containerRegistryRG string = 'caringup-shared'
param enableIngress bool
param minReplicas int = 0
param maxReplicas int = 1
param env array = []
param enableDapr bool = false
param containerCpu string
param containerMemory string
param containerScalseConcurrentRequests string

resource environment 'Microsoft.App/managedEnvironments@2022-01-01-preview' existing = {
  name: environmentName
}

resource registry 'Microsoft.ContainerRegistry/registries@2021-12-01-preview' existing = {
  name: containerRegistry
  scope: resourceGroup(containerRegistryRG)
}

resource containerApp 'Microsoft.App/containerApps@2022-01-01-preview' = {
  name: containerAppName
  location: location
  properties: {
    managedEnvironmentId: environment.id
    configuration: {
      secrets: [
        {
          name: 'container-registry-password'
          value: registry.listCredentials().passwords[0].value
        }
      ]
      registries: [
        {
          server: '${containerRegistry}.azurecr.io'
          username: registry.listCredentials().username
          passwordSecretRef: 'container-registry-password'
        }
      ]
      ingress: {
        external: isExternalIngress
        targetPort: containerPort
        transport: 'auto'
      }
      dapr: {
        enabled: enableDapr
        appPort: containerPort
        appId: containerAppName
        appProtocol: 'http'
      }
    }
    template: {
      containers: [
        {
          image: containerImage
          name: containerAppName
          env: env
          probes: [{
            type: 'Liveness'
            httpGet: {
              path: '/diagnostic/liveness'
              port: containerPort
            }
            initialDelaySeconds: 20
            periodSeconds: 5
          }]
          resources: {
            cpu: json(containerCpu)
            memory: containerMemory
          }
        }
      ]
      scale: {
        minReplicas: minReplicas
        maxReplicas: maxReplicas
        rules: [
          {
            name: 'httpconcurrentrequestsscale'
            http: {
              metadata: {
                concurrentRequests: containerScalseConcurrentRequests
              }
            }
          }
        ]
      }
    }
  }
  identity: {
    type: 'SystemAssigned'
  }
}

output fqdn string = enableIngress ? containerApp.properties.configuration.ingress.fqdn : 'Ingress not enabled'
output principalId string = containerApp.identity.principalId
output resourceId string = containerApp.id
