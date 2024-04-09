---
title: "Gitlab CICD Templates"
published: 2023-01-13
description: "Writing CI templates to run build, test, and deploy your project is challenging to do in a way that prioritizes pipeline speed, safety, and easy maintenance."
image: "../../assets/images/blog-pics/gitlab-ci.jpg"
draft: false
tags: ["Cloud", "CI-CD", "Gitlab"]
category: 'Guides'
---

## Multi-project Pipelines

A pipeline in one project can trigger downstream pipelines in another project, called multi-project pipelines.

```yaml
include:
	- local: workflow1.yml
	- local: workflow2.yml
test:
	script:
		- !reference [.workflow1, key]
		- !reference [.workflow2, key]
```

or if in another dedicated repo (for templates):

```yaml 
include:
	- project: '<group-name>/<poject-name>'
	  ref: <branch>
	  file: '/path/to/file.yml' # can be one file or list of files

	  file:
		  - '/path/to/file1.yml'
		  - '/path/to/file2.yml'
```

## Terraform on gitlab

Terraform files can be deployed easily on gitlab by using environment variables saved in your project ${ENV_NAME}

```yml
stages:
  - validate
  - test
  - build
  - deploy

include:
  - template: Terraform/Base.latest.gitlab-ci.yml
  - template: Jobs/SAST-IaC.latest.gitlab-ci.yml 

variables:
  TF_ROOT: ${CI_PROJECT_DIR}/<terrafrom-directory>
  TF_STATE_NAME: ${CI_ENVIRONMENT_NAME}
  TF_CLI_ARGS_plan: "-var-file=${CI_PROJECT_DIR}/<terraform-directory>/${CI_ENVIRONMENT_NAME}.tfvars"
  TF_VAR_<variable-set-tf-files>: ${<variable-set-project>}

# Validation/Test stage
fmt: 
	extends: .terraform:fmt 
validate: 
	extends: .terraform:validate 

# Build stage
plan dev: 
	extends: .terraform:build 
	environment: 
		name: ${CI_ENVIRONMENT_NAME}

# Deploy stage: configured to only deploy when pushed into main branch by default 
apply dev: 
	extends: .terraform:deploy 
	environment: 
		name: ${CI_ENVIRONMENT_NAME}
```

> You can create your own terraform ci template with the terraform container image:

```yml
image:
  name: hashicorp/terraform:latest
  entrypoint:
    - '/usr/bin/env'
    - 'PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin'
variables:
  TF_STATE_NAME: default
  TF_ROOT: ${CI_PROJECT_DIR}
cache:
  key: "${TF_ROOT}"
  paths:
    - ${TF_ROOT}/.terraform/
```

## References
1.[GitLab CI/CD Examples | GitLab](https://docs.gitlab.com/ee/ci/examples/)
