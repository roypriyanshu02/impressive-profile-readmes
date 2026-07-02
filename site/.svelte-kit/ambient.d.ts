
// this file is generated — do not edit it


/// <reference types="@sveltejs/kit" />

/**
 * Environment variables [loaded by Vite](https://vitejs.dev/guide/env-and-mode.html#env-files) from `.env` files and `process.env`. Like [`$env/dynamic/private`](https://kit.svelte.dev/docs/modules#$env-dynamic-private), this module cannot be imported into client-side code. This module only includes variables that _do not_ begin with [`config.kit.env.publicPrefix`](https://kit.svelte.dev/docs/configuration#env) _and do_ start with [`config.kit.env.privatePrefix`](https://kit.svelte.dev/docs/configuration#env) (if configured).
 * 
 * _Unlike_ [`$env/dynamic/private`](https://kit.svelte.dev/docs/modules#$env-dynamic-private), the values exported from this module are statically injected into your bundle at build time, enabling optimisations like dead code elimination.
 * 
 * ```ts
 * import { API_KEY } from '$env/static/private';
 * ```
 * 
 * Note that all environment variables referenced in your code should be declared (for example in an `.env` file), even if they don't have a value until the app is deployed:
 * 
 * ```
 * MY_FEATURE_FLAG=""
 * ```
 * 
 * You can override `.env` values from the command line like so:
 * 
 * ```bash
 * MY_FEATURE_FLAG="enabled" npm run dev
 * ```
 */
declare module '$env/static/private' {
	export const LESSOPEN: string;
	export const npm_package_dev: string;
	export const USER: string;
	export const npm_config_user_agent: string;
	export const STARSHIP_SHELL: string;
	export const FZF_CTRL_T_COMMAND: string;
	export const BUN_INSTALL: string;
	export const FZF_DEFAULT_OPTS: string;
	export const npm_node_execpath: string;
	export const npm_package_resolved: string;
	export const XDG_CACHE_HOME: string;
	export const SHLVL: string;
	export const WT_PROFILE_ID: string;
	export const npm_config_noproxy: string;
	export const HOME: string;
	export const OLDPWD: string;
	export const npm_package_optional: string;
	export const npm_package_json: string;
	export const npm_package_engines_node: string;
	export const GOTOOLCHAIN: string;
	export const FNM_ARCH: string;
	export const npm_config_userconfig: string;
	export const npm_config_local_prefix: string;
	export const npm_package_integrity: string;
	export const GOROOT: string;
	export const XDG_STATE_HOME: string;
	export const DBUS_SESSION_BUS_ADDRESS: string;
	export const npm_config_engine_strict: string;
	export const WSL_DISTRO_NAME: string;
	export const FZF_CTRL_R_OPTS: string;
	export const COLOR: string;
	export const DEBUGINFOD_URLS: string;
	export const WAYLAND_DISPLAY: string;
	export const FNM_VERSION_FILE_STRATEGY: string;
	export const FNM_LOGLEVEL: string;
	export const LOGNAME: string;
	export const FNM_NODE_DIST_MIRROR: string;
	export const NAME: string;
	export const WSL_INTEROP: string;
	export const SDKMAN_CANDIDATES_API: string;
	export const PULSE_SERVER: string;
	export const _: string;
	export const npm_config_prefix: string;
	export const npm_config_npm_version: string;
	export const TERM: string;
	export const npm_config_cache: string;
	export const npm_config_node_gyp: string;
	export const PATH: string;
	export const SDKMAN_CANDIDATES_DIR: string;
	export const GOBIN: string;
	export const NODE: string;
	export const npm_package_name: string;
	export const WT_SESSION: string;
	export const SDKMAN_BROKER_API: string;
	export const UV_INSTALL_DIR: string;
	export const XDG_RUNTIME_DIR: string;
	export const DISPLAY: string;
	export const LANG: string;
	export const XDG_DATA_HOME: string;
	export const XDG_CONFIG_HOME: string;
	export const LS_COLORS: string;
	export const MANPAGER: string;
	export const SDKMAN_DIR: string;
	export const SDKMAN_PLATFORM: string;
	export const FNM_DIR: string;
	export const npm_lifecycle_script: string;
	export const FNM_RESOLVE_ENGINES: string;
	export const SHELL: string;
	export const GOPATH: string;
	export const npm_package_version: string;
	export const npm_lifecycle_event: string;
	export const CXX: string;
	export const CARGO_INSTALL_ROOT: string;
	export const LESSCLOSE: string;
	export const npm_package_dev_optional: string;
	export const npm_config_globalconfig: string;
	export const npm_config_init_module: string;
	export const npm_package_peer: string;
	export const PWD: string;
	export const FZF_DEFAULT_COMMAND: string;
	export const GRADLE_USER_HOME: string;
	export const FNM_MULTISHELL_PATH: string;
	export const npm_execpath: string;
	export const CARGO_HOME: string;
	export const XDG_DATA_DIRS: string;
	export const npm_config_global_prefix: string;
	export const STARSHIP_SESSION_KEY: string;
	export const npm_config_allow_scripts: string;
	export const npm_command: string;
	export const FNM_COREPACK_ENABLED: string;
	export const CC: string;
	export const WSL2_GUI_APPS_ENABLED: string;
	export const HOSTTYPE: string;
	export const WSLENV: string;
	export const INIT_CWD: string;
	export const EDITOR: string;
}

/**
 * Similar to [`$env/static/private`](https://kit.svelte.dev/docs/modules#$env-static-private), except that it only includes environment variables that begin with [`config.kit.env.publicPrefix`](https://kit.svelte.dev/docs/configuration#env) (which defaults to `PUBLIC_`), and can therefore safely be exposed to client-side code.
 * 
 * Values are replaced statically at build time.
 * 
 * ```ts
 * import { PUBLIC_BASE_URL } from '$env/static/public';
 * ```
 */
declare module '$env/static/public' {
	
}

/**
 * This module provides access to runtime environment variables, as defined by the platform you're running on. For example if you're using [`adapter-node`](https://github.com/sveltejs/kit/tree/master/packages/adapter-node) (or running [`vite preview`](https://kit.svelte.dev/docs/cli)), this is equivalent to `process.env`. This module only includes variables that _do not_ begin with [`config.kit.env.publicPrefix`](https://kit.svelte.dev/docs/configuration#env) _and do_ start with [`config.kit.env.privatePrefix`](https://kit.svelte.dev/docs/configuration#env) (if configured).
 * 
 * This module cannot be imported into client-side code.
 * 
 * ```ts
 * import { env } from '$env/dynamic/private';
 * console.log(env.DEPLOYMENT_SPECIFIC_VARIABLE);
 * ```
 * 
 * > In `dev`, `$env/dynamic` always includes environment variables from `.env`. In `prod`, this behavior will depend on your adapter.
 */
declare module '$env/dynamic/private' {
	export const env: {
		LESSOPEN: string;
		npm_package_dev: string;
		USER: string;
		npm_config_user_agent: string;
		STARSHIP_SHELL: string;
		FZF_CTRL_T_COMMAND: string;
		BUN_INSTALL: string;
		FZF_DEFAULT_OPTS: string;
		npm_node_execpath: string;
		npm_package_resolved: string;
		XDG_CACHE_HOME: string;
		SHLVL: string;
		WT_PROFILE_ID: string;
		npm_config_noproxy: string;
		HOME: string;
		OLDPWD: string;
		npm_package_optional: string;
		npm_package_json: string;
		npm_package_engines_node: string;
		GOTOOLCHAIN: string;
		FNM_ARCH: string;
		npm_config_userconfig: string;
		npm_config_local_prefix: string;
		npm_package_integrity: string;
		GOROOT: string;
		XDG_STATE_HOME: string;
		DBUS_SESSION_BUS_ADDRESS: string;
		npm_config_engine_strict: string;
		WSL_DISTRO_NAME: string;
		FZF_CTRL_R_OPTS: string;
		COLOR: string;
		DEBUGINFOD_URLS: string;
		WAYLAND_DISPLAY: string;
		FNM_VERSION_FILE_STRATEGY: string;
		FNM_LOGLEVEL: string;
		LOGNAME: string;
		FNM_NODE_DIST_MIRROR: string;
		NAME: string;
		WSL_INTEROP: string;
		SDKMAN_CANDIDATES_API: string;
		PULSE_SERVER: string;
		_: string;
		npm_config_prefix: string;
		npm_config_npm_version: string;
		TERM: string;
		npm_config_cache: string;
		npm_config_node_gyp: string;
		PATH: string;
		SDKMAN_CANDIDATES_DIR: string;
		GOBIN: string;
		NODE: string;
		npm_package_name: string;
		WT_SESSION: string;
		SDKMAN_BROKER_API: string;
		UV_INSTALL_DIR: string;
		XDG_RUNTIME_DIR: string;
		DISPLAY: string;
		LANG: string;
		XDG_DATA_HOME: string;
		XDG_CONFIG_HOME: string;
		LS_COLORS: string;
		MANPAGER: string;
		SDKMAN_DIR: string;
		SDKMAN_PLATFORM: string;
		FNM_DIR: string;
		npm_lifecycle_script: string;
		FNM_RESOLVE_ENGINES: string;
		SHELL: string;
		GOPATH: string;
		npm_package_version: string;
		npm_lifecycle_event: string;
		CXX: string;
		CARGO_INSTALL_ROOT: string;
		LESSCLOSE: string;
		npm_package_dev_optional: string;
		npm_config_globalconfig: string;
		npm_config_init_module: string;
		npm_package_peer: string;
		PWD: string;
		FZF_DEFAULT_COMMAND: string;
		GRADLE_USER_HOME: string;
		FNM_MULTISHELL_PATH: string;
		npm_execpath: string;
		CARGO_HOME: string;
		XDG_DATA_DIRS: string;
		npm_config_global_prefix: string;
		STARSHIP_SESSION_KEY: string;
		npm_config_allow_scripts: string;
		npm_command: string;
		FNM_COREPACK_ENABLED: string;
		CC: string;
		WSL2_GUI_APPS_ENABLED: string;
		HOSTTYPE: string;
		WSLENV: string;
		INIT_CWD: string;
		EDITOR: string;
		[key: `PUBLIC_${string}`]: undefined;
		[key: `${string}`]: string | undefined;
	}
}

/**
 * Similar to [`$env/dynamic/private`](https://kit.svelte.dev/docs/modules#$env-dynamic-private), but only includes variables that begin with [`config.kit.env.publicPrefix`](https://kit.svelte.dev/docs/configuration#env) (which defaults to `PUBLIC_`), and can therefore safely be exposed to client-side code.
 * 
 * Note that public dynamic environment variables must all be sent from the server to the client, causing larger network requests — when possible, use `$env/static/public` instead.
 * 
 * ```ts
 * import { env } from '$env/dynamic/public';
 * console.log(env.PUBLIC_DEPLOYMENT_SPECIFIC_VARIABLE);
 * ```
 */
declare module '$env/dynamic/public' {
	export const env: {
		[key: `PUBLIC_${string}`]: string | undefined;
	}
}
