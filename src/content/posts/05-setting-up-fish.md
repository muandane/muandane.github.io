---
title: "From zsh to fish a Setup Guide"
published: 2024-01-04
description: "From zsh to fish a Setup Guide"
image: "../../assets/images/blog-pics/fish-shell.jpg"
tags: ["Shell", "ZSH", "Starship"]
category: 'Guides'
draft: false
---

When I started my journey as a DevOps engineer, I started with zsh and was super satisfied. Over time, I built my own configuration on top of oh-my-zsh, adding plugins, themes, and customizations to make my terminal experience great.

The features and improvements it makes on plain old bash are impressive. But as my needs change, so does my shell. In this post, I will lay out my motivations for the switch, along with some details of my new configurations and all the gotchas that I had to endure!

First, let me be very clear - I know that zsh + oh-my-zsh is really awesome, and you can almost certainly configure zsh to do almost everything that you with the fish shell - well, at least everything I am going to describe in this post.

:::note

Fish is an awesome user-friendly command line shell! In this post, we'll discuss all the advantages of using Fish, along with the caveats and plugins that may come in handy. Fish stands out because of these impressive features:

- Inline auto-suggestions based on history
- tab completion, and web-based configuration
- Syntax Highlighting, and intuitive wildcard support

:::

## The Why

I absolutely loved using Zsh while at work because of its extensive customization options. However, I have noticed consistent performance issues over my time with it. Numerous online resources confirm these slowdowns, with anecdotal evidence suggesting getting >5 second just to get a new zsh prompt.

Enter Fish! intrigued by its reputation for speed and efficiency. The contrast was stark! Fish's rapid performance, coupled with features such as built-in auto-suggestions, syntax highlighting, and intuitive tab completion, make it an extremely user-friendly experience. Without a doubt, Fish's superior speed and ease of use have won me over, despite my special place in my heart for Zsh (being a POSIX shell).

![fish-demo](../../assets/images/blog-pics/fish-demo.gif "fish-demo")

## Into the switch

### 1. Install fish

Do the easy thing on Mac:

```sh
$ brew install fish
$ fish --version
fish, version 3.7.1
```

Note that I'm using Alacritty & iterm2 as my terminal emulators. with a Nerd font patched ComicShannsMono.

In order to setup it as default shell, you have to edit /etc/shells file to add `"$(which fish)" (for me it's /opt/homebrew/bin/fish)` as an entry to it (highlighted below in the codeblock):

```yaml
# List of acceptable shells for chpass(1).
# Ftpd will not allow users to connect who are not using
# one of these shells.

/bin/bash
/bin/csh
/bin/dash
/bin/ksh
/bin/sh
/bin/tcsh
/bin/zsh
/usr/local/bin/zsh
/usr/local/bin/fish
/opt/homebrew/bin/fish
```

```sh
$ chsh -s $(which fish)
```

Configuration is added to this path:

```sh
mkdir -p $HOME/.config/fish
touch vim $HOME/.config/fish/config.fish
```

### 2. Install Fish plugin manager (oh-my-fish aka omf or fisher)

If you're familiar with oh-my-zsh, [oh-my-fish](https://github.com/oh-my-fish/oh-my-fish) appears to be the most widely used fish plugin manager and functions as expected, i personally use fisher but it's up to you the reader which one to use as they all provide somewhat the same feature while absolutely not bogging down the terminal session (Note: fisher has fzf.fish which allows for fuzzy finding in shell history):

```sh
$ curl https://raw.githubusercontent.com/oh-my-fish/oh-my-fish/master/bin/install | fish
$ omf version
Oh My Fish version 7
```

```sh
$ curl -sL https://raw.githubusercontent.com/jorgebucaran/fisher/main/functions/fisher.fish | source && fisher install jorgebucaran/fisher
$ fisher --version
fisher, version 4.4.4
$ fisher install PatrickF1/fzf.fish
```

### 3. Emulate Bash command substitution

If you used Bash extensivly you migh be used to `!!` and `!$` (shorthand for last command and last argument of last command respectively) and emit them almost automatically at this point. Even though I was hesitant to learn a new style, I managed to make both bangbang and bangdollar work by following this helpful [StackOverflow](https://superuser.com/questions/719531/what-is-the-equivalent-of-bashs-and-in-the-fish-shell) thread and [this page](https://github.com/fish-shell/fish-shell/wiki/Bash-Style-Command-Substitution-and-Chaining-(!!-!%24-&&-%7C%7C)) on the fish wiki.

I created the file `~/.config/fish/config.fish` and pasted functions bind_bang, bind_dollar and fish_user_key_bindings in and it works great.

### 4. adding starship

Starship is a cross-shell prompt with a ton of customization options, i prefer it over oh-my-zsh/powerlevel10k.

```sh
$ brew install starship 
```

Feel free to read [this documentation](https://starship.rs/config/#prompt) to customize your prompt how you like it:

```sh
$ touch $HOME/.config/starship.toml
```

## Mistakes I Made Along The Way

1. Adding too many plugins at once
2. Misunderstanding fish’s “interactive first” mindset
3. Having omf and tide collide and breaking my prompt
4. Expecting fish to be equivalent to zsh out-of-the-box
5. Not reading the docs about configuring environment variables
