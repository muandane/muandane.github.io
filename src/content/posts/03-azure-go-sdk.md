---
title: "Getting Started with Azure SDK for Go"
published: 2023-09-18
description: "A Journey into Developing Storage Drivers."
image: "../../assets/images/blog-pics/go-sdk.jpg"
draft: false
tags: [Golang, Azure, Demo]
category: Guides
---

## Getting Started with Azure SDK for Go: A Journey into Developing Storage Drivers

Azure SDK for Go is an essential tool for software development in the Azure cloud environment. It offers developers a powerful, dynamic, and interactive way to interact with Azure services using the Go programming language. This article walks you through the basics of using the Azure SDK for Go, with a special focus on creating command-line (CLI) pluggable storage drivers. This is part of the overall research project to create a CLI to take backups of PostgreSQL databases and send them to an Azure storage account.

## Getting Started with Azure SDK for Go

Azure SDK for Go provides many features, from managing Azure resources to processing data from Azure storage services. It is designed to be easy to use, efficient and flexible according to the development needs. To get started using the Azure SDK for Go, you need to install it using the go command:

```sh
go get -u github.com/Azure/azure-sdk-for-go/...
```

Once installed, you can import the necessary packages in your Go code and interact with Azure services.

## Setting Up Environment Variables

Before you start interacting with Azure services, you need to set up the following environment variables:

```sh
export AZURE_CLIENT_ID="__CLIENT_ID__"
export AZURE_CLIENT_SECRET="__CLIENT_SECRET__"
export AZURE_TENANT_ID="__TENANT_ID__"
export AZURE_SUBSCRIPTION_ID="__SUBSCRIPTION_ID__"
```

These environment variables are used by the Azure SDK for Go to authenticate your application with Azure.

## Authenticating to Azure

To run code against an Azure subscription, you need to authenticate to Azure. The `azidentity` package provides multiple options to authenticate to Azure, including client/secret, certificate, and managed identity. The following code snippet shows how to create an `azidentity` object:

```go
cred, err := azidentity.NewDefaultAzureCredential(nil)
if err != nil {
  // handle error
}
```

This code uses the environment variables set earlier to authenticate to Azure.

## Creating Azure Resources

To set up Azure resources, you first need to decide which client you want to use. For example, if you want to create a group, you can use `ResourceGroupsClient`. Once you define a client, you can use it to make API calls to create, update, read, or delete Azure resources. Most of these operations are CRUD (create/read/update/delete) operations.

Here is an example of how to create a resource group:

```go
ctx := context.Background()
resourceGroupName := "testresourcegroup"
location := "francecentral"

resourceGroupParameters := armresources.ResourceGroup{
  Location: to.StringPtr(location),
}

_, err = resourceGroupsClient.CreateOrUpdate(ctx, resourceGroupName, resourceGroupParameters, nil)
if err != nil {
  // handle error
}
```

In this example, we first create a context, then define the name and location of the resource group we want to create. We then create a `ResourceGroup` object with the specified location, and finally, we call the `CreateOrUpdate` method of the `resourceGroupsClient` to create the resource group.

## Long-Running Operations

Some projects in Azure can take a long time to complete. The Azure SDK for Go provides support for long-running operations (LROs) via asynchronous calls. This list of functions starts with `Start` and returns a `Poller` object. The `poller` object is used to periodically poll the service until it completes. Here is an example of this type:

```go
ctx := context.Background()
poller, err := client.BeginCreate(ctx, "resource_identifier", "additional_parameter")
if err != nil {
  // handle error...
}
resp, err = poller.PollUntilDone(ctx, nil)
if err != nil {
  // handle error...
}
fmt.Printf("LRO done")
```

In this example, we first call an asynchronous function to create a client, which returns a `Poller` object. We then call the `Poller` object's `PollUntilDone` function, which blocks until the original asynchronous function has completed.

## Developing Storage Drivers with Azure SDK for Go

One of the most common use cases for the Azure SDK for Go is interacting with Azure Blob Storage. This is a scalable, secure, and cost-effective solution for storing large amounts of unstructured data. In our case, we want to use it to store backups of PostgreSQL databases.

To interact with Azure Blob Storage, you need to create an instance of the `BlobServiceClient` type. This instance represents the Azure Storage account and is used to perform operations on the blobs within the account. Here is an example of how to create a `BlobServiceClient`:

```go
accountName, accountKey := "<azure-account-name>", "<azure-account-key>"
credential, _ := azblob.NewSharedKeyCredential(accountName, accountKey)
client, _ := azblob.NewServiceClient(fmt.Sprintf("https://%s.blob.core.windows.net/", accountName), credential, nil)
```

In the above code, we first create a shared key credential using the Azure account's name and key. Then, we create a new service client using the shared key credential.

### Plugging Storage Drivers into a CLI

We can create a go function that interacts with Azure Blob storage. This function can be extended to the CLI to provide an easy way to manage resources such as PostgreSQL database backups.

[pisq](https://github.com/muandane/pisq) is a CLI that uses the Azure SDK to upload backups to an Azure storage account. The `Upload` feature is a clear example of this integration:

```go
package azure

import (
  "context"
  "fmt"
  "net/url"
  "os"

  "github.com/charmbracelet/log"

  "github.com/Azure/azure-storage-blob-go/azblob"
)

func Upload(azureContainerName string, backupPath, azureAccountName string, azureAccountKey string) {
  credential, err := azblob.NewSharedKeyCredential(azureAccountName, azureAccountKey)
  if err != nil {
    log.Fatalf("Wrong Credntials: %v", err)
  }
  pipeline := azblob.NewPipeline(credential, azblob.PipelineOptions{})
  URL, _ := url.Parse(
    fmt.Sprintf("https://%s.blob.core.windows.net/%s", azureAccountName, azureContainerName))

  containerURL := azblob.NewContainerURL(*URL, pipeline)

  file, err := os.Open(backupPath)
  if err != nil {
    log.Fatalf("File already exists:%v", err)
  }
  defer file.Close()

  blockBlobURL := containerURL.NewBlockBlobURL(backupPath)
  _, err = azblob.UploadFileToBlockBlob(context.Background(), file, blockBlobURL, azblob.UploadToBlockBlobOptions{})
  if err != nil {
    log.Error("Error while uploading file to container in Azure Storage account", err)
  } else {
    log.Info("Upload completed successfully!")
  }
}
```

This function takes the container name, path to the backup file, Azure account name, and Azure account key as parameters. It first creates a shared key credential using the Azure account name and key. A pipeline is then created with the credential. A URL is generated for the Azure Blob Storage container, and a new container URL is created with the pipeline. The function then opens the backup file and creates a new block blob URL. Finally, the backup file is uploaded to the block blob.

## Conclusion

The Azure SDK for Go provides a powerful and effective way to interact with Azure services. Using the SDK, you can manage and interact with Azure resources directly from your Go application. From setting up environment changes and authentication in Azure to setting up Azure resources and hosting long-term workloads, the Azure SDK for Go has you covered.

The integration of this SDK with the CLI shows that it is possible to build drivers, as shown in [pisq](https://github.com/muandane/pisq). This integration allows easy management of resources such as PostgreSQL database backups directly from the CLI.

As Azure continues to improve and expand its capabilities, the Azure SDK for Go is becoming a reliable tool for developers. It is designed to keep up with the growth of Azure, providing developers with the tools to build, manage and optimize their applications on the Azure platform.
