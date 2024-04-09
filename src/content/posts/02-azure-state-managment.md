---
title: "Terraform State Managment in Azure"
published: 2023-05-24
description: "Terraform AKS deployment state managment with azure storage account"
image: "../../assets/images/blog-pics/tf-state.jpg"
draft: false
tags: [Markdown, Blogging, Demo]
category: Guides
---

## Scenario

We have an already deployed AKS cluster with already deployed storage etc.

Storage wise we can use a backend block to the terraform providers configuration :

```hcl
terraform { 
  backend "azurerm" {
    storage_account_name = "storage-account-name"
    container_name       = "aks-container-name"
    key                  = "dev.terraform.aks-container-name" <- this corresponds to a state file or state of terraform if you choose to seperate parts of terraform you to give them different keys so they woont overwrite each other/ destroy.
  }
}
```

```sh
source:
  stage: source
  environment: ci-env
  before_script:
    - ''
  image: mcr.microsoft.com/azure-cli
  script:
    - echo "get access token from Azure"
    - az login --service-principal -u ${TF_VAR_CLIENT_ID} -p ${TF_VAR_SERVICEPRINCIPLE_SECRET} --tenant ${TF_VAR_TENANT}
    - echo "ARM_ACCESS_KEY=$(az storage account keys list -g ${TF_STORAGE_ACCOUNT_RESOURCE_GROUP_NAME} -n ${TF_STORAGE_ACCOUNT_NAME} --query [0].value -o tsv)" >> build.env
  artifacts:
    reports:
      dotenv: build.env
```

Besides that when you have a current production AKS cluster up you might be concerned by whether your new deployment pipeline may replace or interrupt your running workloads.

## Prerequisites

1. A workload running on kubernetes: any application or workload that is already up and running in any namespace.
2. Uptime check: Monitoring the workload is a way of validating that your workload has not been interrupted.
3. Permissions: Permissions are needed to configure kubernetes.
4. Gitlab: a project that isn't linked to a kubernetes cluster.

## Feature toggles

**Feature flags:** they are flags that controls the behavior of your software/deployment without the need of redeployment or changing code, which allows release of features with zero downtime.

In Terraform, we can create a feature toggle with a conditional expression. By adding the count meta-argument to the resource, we can toggle the creation of a specific resource.

```yaml
variable "enable_new_ami" {
 default = false
 type    = bool
}
resource "instance" "example" {
 count                  = var.enable_new_ami ? 1 : 0
 instance_type          = "<instance-type>"
 tags = {
  Has_Toggle = var.enable_new_ami
 }
}

```

## Terraform Azure AD access with feature flags

> azure ad goals
> create_azure_ad_group
> assign_azure_ad_group

This requires the use of **count** **compact** **dynamic** functions in terraform, we start with defining our groups:

```yaml
data "azuread_client_config" "current" {}

data "azuread_groups" "admin" {
  count         = var.enable_feature ? 1 : 0
  display_names = ["<admin-group1>", "<admin-group2>", "<admin-group3>"]
}

data "azuread_group" "reader" {
  count        = var.enable_feature ? 1 : 0
  display_name = "<reader-group>"
}
```

They we use **dynamic** block on the *azure_active_directory_role_based_access_control*, the compact will turn the list into a string so we can use the feature toggle:

```yaml
dynamic "azure_active_directory_role_based_access_control"{
  for_each = var.enable_feature ? compact(data.azuread_groups.admin[*].object_ids) : []
  content {
    managed = true
    admin_group_object_ids = each.value
    azure_rbac_enabled = true
  }
}
```

In case you had a personal spn and want to grant access got to:
azure ad > api permissions > add permission > microsoft graph > application permission > group > group.readwrite.all

## References

1.[Cloud-Native-Security/terraform-and-argocd (github.com)](https://github.com/Cloud-Native-Security/terraform-and-argocd)
2.[Docs overview | hashicorp/helm | Terraform Registry](https://registry.terraform.io/providers/hashicorp/helm/latest/docs)
