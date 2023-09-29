Param (
	# Resource group
	[string] $resourceGroupName = 'guardianlitev2-rsg',

	[string] $existingResourceGroupName = 'guardianlite-rsg',

    [string] $secondLocation,

    [string] $existingApplicationInsightsName,

    [string] $environmentName = 'dev',

    [string] $containerImage = 'drugdataservice:latest',

    [string] $azureKeyVault = 'guardiandbkeys',

    [string] $dbhost = 'guardiandedev.mysql.database.azure.com',

    [string] $dialect = 'mysql',

    [string] $appport = '8888',

    [string] $dbname = 'drug_data_service',

    [int] $minContainerReplicas = 1,

    [int] $maxContainerReplicas = 1,

    [string] $containerCpu = '0.5',

    [string] $containerMemory = '1Gi',

    [string] $containerScalseConcurrentRequests = '100'
)

az deployment group create -g $resourceGroupName -f ./main.bicep -p `
environmentName=$environmentName `
existingResourceGroupName=$existingResourceGroupName `
secondLocation=$secondLocation `
containerImage=$containerImage `
dbname=$dbname `
dialect=$dialect `
existingApplicationInsightsName=$existingApplicationInsightsName `
appport=$appport `
minContainerReplicas=$minContainerReplicas `
maxContainerReplicas=$maxContainerReplicas `
containerCpu=$containerCpu `
containerMemory=$containerMemory `
containerScalseConcurrentRequests=$containerScalseConcurrentRequests `
host=$dbhost `
keyVaultName=$azureKeyVault