"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core = __importStar(require("@actions/core"));
const exec = __importStar(require("@actions/exec"));
const cache = __importStar(require("@actions/cache"));
const config_1 = __importDefault(require("./config"));
function setup() {
    return __awaiter(this, void 0, void 0, function* () {
        // Define install commands for different os
        const install = {
            Linux: 'sudo apt-get install -y ccache',
            Windows: 'choco install ccache',
            macOS: 'brew install ccache'
        };
        core.info(`Installing ccache on ${config_1.default.os}`);
        yield exec.exec(install[config_1.default.os]);
    });
}
function restore() {
    return __awaiter(this, void 0, void 0, function* () {
        // Recover key from input and configure cache key
        const restoreKey = config_1.default.restoreKey;
        const paths = [config_1.default.cache_dir];
        const cachekey = config_1.default.cacheKey;
        const restoreKeys = [restoreKey];
        // Restore the cache from key
        const restored = yield cache.restoreCache(paths, cachekey, restoreKeys);
        if (restored) {
            core.info(`Restored cache from key ${restored}`);
        }
        else {
            core.info("Couldn't load cache");
        }
    });
}
function setConfig(key, value) {
    return __awaiter(this, void 0, void 0, function* () {
        yield exec.exec(`ccache --set-config=${key}=${value}`);
    });
}
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // warn for windows
            if (config_1.default.os === 'Windows') {
                core.warning('ccache may not work properly on windows, if you are using MSVC compiler.');
            }
            yield setup();
            yield restore();
            // Configure ccache
            core.info('Configuring ccache...');
            const cacheDir = `${process.env.GITHUB_WORKSPACE}/${config_1.default.cache_dir}`;
            yield setConfig('cache_dir', cacheDir);
            yield setConfig('compression', 'true');
            yield setConfig('compiler', config_1.default.compiler);
            if (config_1.default.path) {
                yield setConfig('path', config_1.default.path);
            }
            // Show ccache config
            core.info('Ccache configuration:');
            yield exec.exec('ccache -p');
            // Zero the ccache statistics
            yield exec.exec('ccache -z');
        }
        catch (error) {
            // Show fail error if there is any error
            core.error(error);
            core.setFailed(error.message);
        }
    });
}
run();
