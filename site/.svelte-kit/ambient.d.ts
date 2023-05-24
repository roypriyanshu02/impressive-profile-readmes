
// this file is generated — do not edit it


/// <reference types="@sveltejs/kit" />

/**
 * Environment variables [loaded by Vite](https://vitejs.dev/guide/env-and-mode.html#env-files) from `.env` files and `process.env`. Like [`$env/dynamic/private`](https://kit.svelte.dev/docs/modules#$env-dynamic-private), this module cannot be imported into client-side code. This module only includes variables that _do not_ begin with [`config.kit.env.publicPrefix`](https://kit.svelte.dev/docs/configuration#env).
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
	export const COLOR: string;
	export const COMP_WORDBREAKS: string;
	export const DBUS_SESSION_BUS_ADDRESS: string;
	export const DISPLAY: string;
	export const EDITOR: string;
	export const HISTFILESIZE: string;
	export const HISTIGNORE: string;
	export const HISTSIZE: string;
	export const HOME: string;
	export const HOSTTYPE: string;
	export const INIT_CWD: string;
	export const LANG: string;
	export const LC_CTYPE: string;
	export const LESS: string;
	export const LESSCLOSE: string;
	export const LESSOPEN: string;
	export const LOGNAME: string;
	export const LSCOLORS: string;
	export const LS_COLORS: string;
	export const MOTD_SHOWN: string;
	export const NAME: string;
	export const NODE: string;
	export const OLDPWD: string;
	export const OSH: string;
	export const PAGER: string;
	export const PATH: string;
	export const PULSE_SERVER: string;
	export const PWD: string;
	export const SHELL: string;
	export const SHLVL: string;
	export const SNAP: string;
	export const SNAP_ARCH: string;
	export const SNAP_COMMON: string;
	export const SNAP_CONTEXT: string;
	export const SNAP_COOKIE: string;
	export const SNAP_DATA: string;
	export const SNAP_INSTANCE_KEY: string;
	export const SNAP_INSTANCE_NAME: string;
	export const SNAP_LIBRARY_PATH: string;
	export const SNAP_NAME: string;
	export const SNAP_REAL_HOME: string;
	export const SNAP_REEXEC: string;
	export const SNAP_REVISION: string;
	export const SNAP_USER_COMMON: string;
	export const SNAP_USER_DATA: string;
	export const SNAP_VERSION: string;
	export const TERM: string;
	export const USER: string;
	export const WAYLAND_DISPLAY: string;
	export const WSL2_GUI_APPS_ENABLED: string;
	export const WSLENV: string;
	export const WSL_DISTRO_NAME: string;
	export const WSL_INTEROP: string;
	export const WT_PROFILE_ID: string;
	export const WT_SESSION: string;
	export const XDG_DATA_DIRS: string;
	export const XDG_RUNTIME_DIR: string;
	export const _: string;
	export const npm_command: string;
	export const npm_config_cache: string;
	export const npm_config_engine_strict: string;
	export const npm_config_global_prefix: string;
	export const npm_config_globalconfig: string;
	export const npm_config_init_module: string;
	export const npm_config_local_prefix: string;
	export const npm_config_metrics_registry: string;
	export const npm_config_node_gyp: string;
	export const npm_config_noproxy: string;
	export const npm_config_prefix: string;
	export const npm_config_user_agent: string;
	export const npm_config_userconfig: string;
	export const npm_execpath: string;
	export const npm_lifecycle_event: string;
	export const npm_lifecycle_script: string;
	export const npm_node_execpath: string;
	export const npm_package_dev: string;
	export const npm_package_dev_optional: string;
	export const npm_package_engines_node: string;
	export const npm_package_integrity: string;
	export const npm_package_json: string;
	export const npm_package_name: string;
	export const npm_package_optional: string;
	export const npm_package_peer: string;
	export const npm_package_resolved: string;
	export const npm_package_version: string;
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
 * This module provides access to runtime environment variables, as defined by the platform you're running on. For example if you're using [`adapter-node`](https://github.com/sveltejs/kit/tree/master/packages/adapter-node) (or running [`vite preview`](https://kit.svelte.dev/docs/cli)), this is equivalent to `process.env`. This module only includes variables that _do not_ begin with [`config.kit.env.publicPrefix`](https://kit.svelte.dev/docs/configuration#env).
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
		COLOR: string;
		COMP_WORDBREAKS: string;
		DBUS_SESSION_BUS_ADDRESS: string;
		DISPLAY: string;
		EDITOR: string;
		HISTFILESIZE: string;
		HISTIGNORE: string;
		HISTSIZE: string;
		HOME: string;
		HOSTTYPE: string;
		INIT_CWD: string;
		LANG: string;
		LC_CTYPE: string;
		LESS: string;
		LESSCLOSE: string;
		LESSOPEN: string;
		LOGNAME: string;
		LSCOLORS: string;
		LS_COLORS: string;
		MOTD_SHOWN: string;
		NAME: string;
		NODE: string;
		OLDPWD: string;
		OSH: string;
		PAGER: string;
		PATH: string;
		PULSE_SERVER: string;
		PWD: string;
		SHELL: string;
		SHLVL: string;
		SNAP: string;
		SNAP_ARCH: string;
		SNAP_COMMON: string;
		SNAP_CONTEXT: string;
		SNAP_COOKIE: string;
		SNAP_DATA: string;
		SNAP_INSTANCE_KEY: string;
		SNAP_INSTANCE_NAME: string;
		SNAP_LIBRARY_PATH: string;
		SNAP_NAME: string;
		SNAP_REAL_HOME: string;
		SNAP_REEXEC: string;
		SNAP_REVISION: string;
		SNAP_USER_COMMON: string;
		SNAP_USER_DATA: string;
		SNAP_VERSION: string;
		TERM: string;
		USER: string;
		WAYLAND_DISPLAY: string;
		WSL2_GUI_APPS_ENABLED: string;
		WSLENV: string;
		WSL_DISTRO_NAME: string;
		WSL_INTEROP: string;
		WT_PROFILE_ID: string;
		WT_SESSION: string;
		XDG_DATA_DIRS: string;
		XDG_RUNTIME_DIR: string;
		_: string;
		npm_command: string;
		npm_config_cache: string;
		npm_config_engine_strict: string;
		npm_config_global_prefix: string;
		npm_config_globalconfig: string;
		npm_config_init_module: string;
		npm_config_local_prefix: string;
		npm_config_metrics_registry: string;
		npm_config_node_gyp: string;
		npm_config_noproxy: string;
		npm_config_prefix: string;
		npm_config_user_agent: string;
		npm_config_userconfig: string;
		npm_execpath: string;
		npm_lifecycle_event: string;
		npm_lifecycle_script: string;
		npm_node_execpath: string;
		npm_package_dev: string;
		npm_package_dev_optional: string;
		npm_package_engines_node: string;
		npm_package_integrity: string;
		npm_package_json: string;
		npm_package_name: string;
		npm_package_optional: string;
		npm_package_peer: string;
		npm_package_resolved: string;
		npm_package_version: string;
		[key: `PUBLIC_${string}`]: undefined;
		[key: string]: string | undefined;
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
