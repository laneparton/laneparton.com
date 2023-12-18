---
title: Running Open Source LLM Models on CentOS 7
published: 2023-12-18T00:00:00.000Z
tags:
  - LLM
  - Docker
  - AI
description: >-
  Explore simple methods for setting up a VM to self-host open source LLMs. A quick retrospective going from installing necessary tools to configuring a demo-ready VM.
---
This week I was given access to a new VM in our datacenter dedicated to exploring LLMs and different AI applications. I [wrote about one of our first PoCs a week ago](https://laneparton.com/posts/powering-in-app-help-with-llm/) - so it was only natural to use it as my guinea pig. I'm no dev-ops wizard - so I stuck to simple infrastructure for now. It's important to note - this VM's purpose is to demo and document PoCs for internal audiences - so we don't need to get too fancy with a production-grade tech-stack.

## Overview
1. Install Necessary Tools
	1. Install Docker
	2. Download an open-source model with `huggingface-cli`
2. Spin up a docker container to interact with the model
3. Add Nginx to make it web-accessible

## Prerequisites

### Install Docker
Probably the easiest, most cookie-cutter part of the whole process and possibly even the most obvious one. Installing docker is a breeze - and so many folks have already written about it. I found this and it *just worked* - so I didn't dig too deep into it all (reminder: I'm not a daily CentOS user).

#### Install Docker
```bash
sudo yum install -y yum-utils
sudo yum-config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo
sudo yum install docker-ce docker-ce-cli containerd.io
```
#### Start and Enable Docker
```bash
sudo systemctl start docker
sudo systemctl enable docker
```
#### Verify Docker Installation
```bash
sudo docker run hello-world
```

...and install docker-compose, create a docker user, etc.

### Install `huggingface-hub` and Download a Model
This is where things got interesting and really might be the crux of the whole post. CentOS 7 comes with Python 2.7 by default, and you'll need Python 3 to use `pip3`.

#### Install Python 3
```bash
sudo yum install -y python3
```

#### Install huggingface-hub
```bash
pip3 install huggingface-hub
```

#### Things break...
```bash
$ huggingface-cli download TheBloke/Mistral-7B-v0.1-GGUF mistral-7b-v0.1.Q5_K_M.gguf --local-dir . --local-dir-use-symlinks False Traceback (most recent call last): File "/usr/local/bin/huggingface-cli", line 7, in <module> from huggingface_hub.commands.huggingface_cli import main File "/usr/local/lib/python3.6/site-packages/huggingface_hub/__init__.py", line 21, in <module> from .commands.user import notebook_login File "/usr/local/lib/python3.6/site-packages/huggingface_hub/commands/user.py", line 26, in <module> from huggingface_hub.hf_api import HfApi, HfFolder File "/usr/local/lib/python3.6/site-packages/huggingface_hub/hf_api.py", line 35, in <module> from .utils.endpoint_helpers import ( File "/usr/local/lib/python3.6/site-packages/huggingface_hub/utils/endpoint_helpers.py", line 17, in <module> from dataclasses import dataclass

ModuleNotFoundError: No module named 'dataclasses'
```
This is where I spent the bulk of my time - fighting my Python installation to get all the pieces I needed. Ultimately it was a question of either: `pip3 install dataclasses` or Upgrade to Python 3.7 or Later. In the moment, I opted for Python 3.7 and went about [building it from the source](https://gist.github.com/wpupru/deda1cd96ea242d9a790e50cd0c97e9f) - with lots of trial and error.

#### Realizing I need Python 3.8+
I spent a lot of time fighting Python errors - trying to fix them - but all of that could have been avoided if I had just looked at pypi - https://pypi.org/project/huggingface-hub/

The error that led me there (for documentation) - it seemed like my huggingface-cli was out of date and didn't support the `download` command.
```bash
$ huggingface-cli download TheBloke/Mistral-7B-v0.1-GGUF mistral-7b-v0.1.Q5_K_M.gguf --local-dir . --local-dir-use-symlinks False usage: huggingface-cli <command> [<args>] huggingface-cli: error: invalid choice: 'download' (choose from 'login', 'whoami', 'logout', 'repo', 'lfs-enable-largefiles', 'lfs-multipart-upload')
```

Ultimately I landed on Python 3.8, installed `huggingface-hub` and was finally able to download the model I wanted.

## Comparing Docker Containers
Honestly, I did a lot of this research ahead of time - but the order it belongs is the way this is written. I spent some time researching and looking for the various means of hosting an LLM on **CPU-Only** hardware - a term/keyword I learned in the process. The entire premise is "How can I host an LLM on my VM".

### llama.cpp
llama.cpp is a port of Facebook's LlaMa model written in C/C++ and right now it seems to be the most advanced in terms of CPU-only infrastructure. Originally I was exploring Dockerfiles that I could host - but ultimately I landed on [llama-cpp-python](https://github.com/abetlen/llama-cpp-python) which can be [dropped straight into](https://python.langchain.com/docs/integrations/llms/llamacpp) my LangChain [example from last week](https://laneparton.com/posts/powering-in-app-help-with-llm/). Ultimately, llama.cpp was the easiest to spin up and for now, it will serve as my primary mechanism for hosting the LLM.

#### Finding GGUF file
llama.cpp specifically requires a `GGUF` file. It exposes an API/CLI to convert a model to this filetype - but I found that [TheBloke on huggingface](https://huggingface.co/TheBloke) provided all I needed to skip this step.

### Ollama
Prior to researching this - I thought Ollama was specifically built for Apple silicon. I guess I completely missed the "Linux" and "Windows" options when I first downloaded it. I was blind to the fact that it had a Dockerfile. At the time of writing, I have not explored Ollama on the VM - but I certainly will.

### vLLM
vLLM is highly discussed and referred to across the various communities talking about hosting open-source models. It has all the bells and whistles - describing itself as "A high-throughput and memory-efficient inference and serving engine for LLMs." However, [right now it is GPU-only](https://github.com/vllm-project/vllm/issues/632) and doesn't support CPU-only infrastructure.

## Next Steps
With an LLM running in a docker container - I opted to wrap things up in a docker-compose and expose the LangChain playground to the web to **finally** test the LLM hosted on our new VM.

It's important to note that this is simply an interim step in the larger process of hosting the PoC.

#### docker-compose.yml
```yaml
version: '3'
services:
  langchain:
    build: ./server
    ports:
      - "8080:8080"
    volumes:
      - /home/docker-user/llama/models:/models
    networks:
      - webnet

  nginx:
    image: nginx:latest
    ports:
      - "80:80"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
    depends_on:
      - langchain
    networks:
      - webnet

networks:
  webnet:
```

#### nginx.conf
```conf
events {}

http {
    server {
        listen 80;

        location / {
            proxy_pass http://langchain:8080/;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_cache_bypass $http_upgrade;
        }
    }
}
```
