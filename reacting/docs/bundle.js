/******/ (function(modules) { // webpackBootstrap
/******/ 	function hotDisposeChunk(chunkId) {
/******/ 		delete installedChunks[chunkId];
/******/ 	}
/******/ 	var parentHotUpdateCallback = window["webpackHotUpdate"];
/******/ 	window["webpackHotUpdate"] = // eslint-disable-next-line no-unused-vars
/******/ 	function webpackHotUpdateCallback(chunkId, moreModules) {
/******/ 		hotAddUpdateChunk(chunkId, moreModules);
/******/ 		if (parentHotUpdateCallback) parentHotUpdateCallback(chunkId, moreModules);
/******/ 	} ;
/******/
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotDownloadUpdateChunk(chunkId) {
/******/ 		var head = document.getElementsByTagName("head")[0];
/******/ 		var script = document.createElement("script");
/******/ 		script.charset = "utf-8";
/******/ 		script.src = __webpack_require__.p + "" + chunkId + "." + hotCurrentHash + ".hot-update.js";
/******/ 		;
/******/ 		head.appendChild(script);
/******/ 	}
/******/
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotDownloadManifest(requestTimeout) {
/******/ 		requestTimeout = requestTimeout || 10000;
/******/ 		return new Promise(function(resolve, reject) {
/******/ 			if (typeof XMLHttpRequest === "undefined")
/******/ 				return reject(new Error("No browser support"));
/******/ 			try {
/******/ 				var request = new XMLHttpRequest();
/******/ 				var requestPath = __webpack_require__.p + "" + hotCurrentHash + ".hot-update.json";
/******/ 				request.open("GET", requestPath, true);
/******/ 				request.timeout = requestTimeout;
/******/ 				request.send(null);
/******/ 			} catch (err) {
/******/ 				return reject(err);
/******/ 			}
/******/ 			request.onreadystatechange = function() {
/******/ 				if (request.readyState !== 4) return;
/******/ 				if (request.status === 0) {
/******/ 					// timeout
/******/ 					reject(
/******/ 						new Error("Manifest request to " + requestPath + " timed out.")
/******/ 					);
/******/ 				} else if (request.status === 404) {
/******/ 					// no update available
/******/ 					resolve();
/******/ 				} else if (request.status !== 200 && request.status !== 304) {
/******/ 					// other failure
/******/ 					reject(new Error("Manifest request to " + requestPath + " failed."));
/******/ 				} else {
/******/ 					// success
/******/ 					try {
/******/ 						var update = JSON.parse(request.responseText);
/******/ 					} catch (e) {
/******/ 						reject(e);
/******/ 						return;
/******/ 					}
/******/ 					resolve(update);
/******/ 				}
/******/ 			};
/******/ 		});
/******/ 	}
/******/
/******/ 	var hotApplyOnUpdate = true;
/******/ 	var hotCurrentHash = "f8f6d94d047e6f36be24"; // eslint-disable-line no-unused-vars
/******/ 	var hotRequestTimeout = 10000;
/******/ 	var hotCurrentModuleData = {};
/******/ 	var hotCurrentChildModule; // eslint-disable-line no-unused-vars
/******/ 	var hotCurrentParents = []; // eslint-disable-line no-unused-vars
/******/ 	var hotCurrentParentsTemp = []; // eslint-disable-line no-unused-vars
/******/
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotCreateRequire(moduleId) {
/******/ 		var me = installedModules[moduleId];
/******/ 		if (!me) return __webpack_require__;
/******/ 		var fn = function(request) {
/******/ 			if (me.hot.active) {
/******/ 				if (installedModules[request]) {
/******/ 					if (installedModules[request].parents.indexOf(moduleId) === -1)
/******/ 						installedModules[request].parents.push(moduleId);
/******/ 				} else {
/******/ 					hotCurrentParents = [moduleId];
/******/ 					hotCurrentChildModule = request;
/******/ 				}
/******/ 				if (me.children.indexOf(request) === -1) me.children.push(request);
/******/ 			} else {
/******/ 				console.warn(
/******/ 					"[HMR] unexpected require(" +
/******/ 						request +
/******/ 						") from disposed module " +
/******/ 						moduleId
/******/ 				);
/******/ 				hotCurrentParents = [];
/******/ 			}
/******/ 			return __webpack_require__(request);
/******/ 		};
/******/ 		var ObjectFactory = function ObjectFactory(name) {
/******/ 			return {
/******/ 				configurable: true,
/******/ 				enumerable: true,
/******/ 				get: function() {
/******/ 					return __webpack_require__[name];
/******/ 				},
/******/ 				set: function(value) {
/******/ 					__webpack_require__[name] = value;
/******/ 				}
/******/ 			};
/******/ 		};
/******/ 		for (var name in __webpack_require__) {
/******/ 			if (
/******/ 				Object.prototype.hasOwnProperty.call(__webpack_require__, name) &&
/******/ 				name !== "e"
/******/ 			) {
/******/ 				Object.defineProperty(fn, name, ObjectFactory(name));
/******/ 			}
/******/ 		}
/******/ 		fn.e = function(chunkId) {
/******/ 			if (hotStatus === "ready") hotSetStatus("prepare");
/******/ 			hotChunksLoading++;
/******/ 			return __webpack_require__.e(chunkId).then(finishChunkLoading, function(err) {
/******/ 				finishChunkLoading();
/******/ 				throw err;
/******/ 			});
/******/
/******/ 			function finishChunkLoading() {
/******/ 				hotChunksLoading--;
/******/ 				if (hotStatus === "prepare") {
/******/ 					if (!hotWaitingFilesMap[chunkId]) {
/******/ 						hotEnsureUpdateChunk(chunkId);
/******/ 					}
/******/ 					if (hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 						hotUpdateDownloaded();
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 		return fn;
/******/ 	}
/******/
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotCreateModule(moduleId) {
/******/ 		var hot = {
/******/ 			// private stuff
/******/ 			_acceptedDependencies: {},
/******/ 			_declinedDependencies: {},
/******/ 			_selfAccepted: false,
/******/ 			_selfDeclined: false,
/******/ 			_disposeHandlers: [],
/******/ 			_main: hotCurrentChildModule !== moduleId,
/******/
/******/ 			// Module API
/******/ 			active: true,
/******/ 			accept: function(dep, callback) {
/******/ 				if (typeof dep === "undefined") hot._selfAccepted = true;
/******/ 				else if (typeof dep === "function") hot._selfAccepted = dep;
/******/ 				else if (typeof dep === "object")
/******/ 					for (var i = 0; i < dep.length; i++)
/******/ 						hot._acceptedDependencies[dep[i]] = callback || function() {};
/******/ 				else hot._acceptedDependencies[dep] = callback || function() {};
/******/ 			},
/******/ 			decline: function(dep) {
/******/ 				if (typeof dep === "undefined") hot._selfDeclined = true;
/******/ 				else if (typeof dep === "object")
/******/ 					for (var i = 0; i < dep.length; i++)
/******/ 						hot._declinedDependencies[dep[i]] = true;
/******/ 				else hot._declinedDependencies[dep] = true;
/******/ 			},
/******/ 			dispose: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			addDisposeHandler: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			removeDisposeHandler: function(callback) {
/******/ 				var idx = hot._disposeHandlers.indexOf(callback);
/******/ 				if (idx >= 0) hot._disposeHandlers.splice(idx, 1);
/******/ 			},
/******/
/******/ 			// Management API
/******/ 			check: hotCheck,
/******/ 			apply: hotApply,
/******/ 			status: function(l) {
/******/ 				if (!l) return hotStatus;
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			addStatusHandler: function(l) {
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			removeStatusHandler: function(l) {
/******/ 				var idx = hotStatusHandlers.indexOf(l);
/******/ 				if (idx >= 0) hotStatusHandlers.splice(idx, 1);
/******/ 			},
/******/
/******/ 			//inherit from previous dispose call
/******/ 			data: hotCurrentModuleData[moduleId]
/******/ 		};
/******/ 		hotCurrentChildModule = undefined;
/******/ 		return hot;
/******/ 	}
/******/
/******/ 	var hotStatusHandlers = [];
/******/ 	var hotStatus = "idle";
/******/
/******/ 	function hotSetStatus(newStatus) {
/******/ 		hotStatus = newStatus;
/******/ 		for (var i = 0; i < hotStatusHandlers.length; i++)
/******/ 			hotStatusHandlers[i].call(null, newStatus);
/******/ 	}
/******/
/******/ 	// while downloading
/******/ 	var hotWaitingFiles = 0;
/******/ 	var hotChunksLoading = 0;
/******/ 	var hotWaitingFilesMap = {};
/******/ 	var hotRequestedFilesMap = {};
/******/ 	var hotAvailableFilesMap = {};
/******/ 	var hotDeferred;
/******/
/******/ 	// The update info
/******/ 	var hotUpdate, hotUpdateNewHash;
/******/
/******/ 	function toModuleId(id) {
/******/ 		var isNumber = +id + "" === id;
/******/ 		return isNumber ? +id : id;
/******/ 	}
/******/
/******/ 	function hotCheck(apply) {
/******/ 		if (hotStatus !== "idle")
/******/ 			throw new Error("check() is only allowed in idle status");
/******/ 		hotApplyOnUpdate = apply;
/******/ 		hotSetStatus("check");
/******/ 		return hotDownloadManifest(hotRequestTimeout).then(function(update) {
/******/ 			if (!update) {
/******/ 				hotSetStatus("idle");
/******/ 				return null;
/******/ 			}
/******/ 			hotRequestedFilesMap = {};
/******/ 			hotWaitingFilesMap = {};
/******/ 			hotAvailableFilesMap = update.c;
/******/ 			hotUpdateNewHash = update.h;
/******/
/******/ 			hotSetStatus("prepare");
/******/ 			var promise = new Promise(function(resolve, reject) {
/******/ 				hotDeferred = {
/******/ 					resolve: resolve,
/******/ 					reject: reject
/******/ 				};
/******/ 			});
/******/ 			hotUpdate = {};
/******/ 			var chunkId = "main";
/******/ 			{
/******/ 				// eslint-disable-line no-lone-blocks
/******/ 				/*globals chunkId */
/******/ 				hotEnsureUpdateChunk(chunkId);
/******/ 			}
/******/ 			if (
/******/ 				hotStatus === "prepare" &&
/******/ 				hotChunksLoading === 0 &&
/******/ 				hotWaitingFiles === 0
/******/ 			) {
/******/ 				hotUpdateDownloaded();
/******/ 			}
/******/ 			return promise;
/******/ 		});
/******/ 	}
/******/
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotAddUpdateChunk(chunkId, moreModules) {
/******/ 		if (!hotAvailableFilesMap[chunkId] || !hotRequestedFilesMap[chunkId])
/******/ 			return;
/******/ 		hotRequestedFilesMap[chunkId] = false;
/******/ 		for (var moduleId in moreModules) {
/******/ 			if (Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
/******/ 				hotUpdate[moduleId] = moreModules[moduleId];
/******/ 			}
/******/ 		}
/******/ 		if (--hotWaitingFiles === 0 && hotChunksLoading === 0) {
/******/ 			hotUpdateDownloaded();
/******/ 		}
/******/ 	}
/******/
/******/ 	function hotEnsureUpdateChunk(chunkId) {
/******/ 		if (!hotAvailableFilesMap[chunkId]) {
/******/ 			hotWaitingFilesMap[chunkId] = true;
/******/ 		} else {
/******/ 			hotRequestedFilesMap[chunkId] = true;
/******/ 			hotWaitingFiles++;
/******/ 			hotDownloadUpdateChunk(chunkId);
/******/ 		}
/******/ 	}
/******/
/******/ 	function hotUpdateDownloaded() {
/******/ 		hotSetStatus("ready");
/******/ 		var deferred = hotDeferred;
/******/ 		hotDeferred = null;
/******/ 		if (!deferred) return;
/******/ 		if (hotApplyOnUpdate) {
/******/ 			// Wrap deferred object in Promise to mark it as a well-handled Promise to
/******/ 			// avoid triggering uncaught exception warning in Chrome.
/******/ 			// See https://bugs.chromium.org/p/chromium/issues/detail?id=465666
/******/ 			Promise.resolve()
/******/ 				.then(function() {
/******/ 					return hotApply(hotApplyOnUpdate);
/******/ 				})
/******/ 				.then(
/******/ 					function(result) {
/******/ 						deferred.resolve(result);
/******/ 					},
/******/ 					function(err) {
/******/ 						deferred.reject(err);
/******/ 					}
/******/ 				);
/******/ 		} else {
/******/ 			var outdatedModules = [];
/******/ 			for (var id in hotUpdate) {
/******/ 				if (Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 					outdatedModules.push(toModuleId(id));
/******/ 				}
/******/ 			}
/******/ 			deferred.resolve(outdatedModules);
/******/ 		}
/******/ 	}
/******/
/******/ 	function hotApply(options) {
/******/ 		if (hotStatus !== "ready")
/******/ 			throw new Error("apply() is only allowed in ready status");
/******/ 		options = options || {};
/******/
/******/ 		var cb;
/******/ 		var i;
/******/ 		var j;
/******/ 		var module;
/******/ 		var moduleId;
/******/
/******/ 		function getAffectedStuff(updateModuleId) {
/******/ 			var outdatedModules = [updateModuleId];
/******/ 			var outdatedDependencies = {};
/******/
/******/ 			var queue = outdatedModules.slice().map(function(id) {
/******/ 				return {
/******/ 					chain: [id],
/******/ 					id: id
/******/ 				};
/******/ 			});
/******/ 			while (queue.length > 0) {
/******/ 				var queueItem = queue.pop();
/******/ 				var moduleId = queueItem.id;
/******/ 				var chain = queueItem.chain;
/******/ 				module = installedModules[moduleId];
/******/ 				if (!module || module.hot._selfAccepted) continue;
/******/ 				if (module.hot._selfDeclined) {
/******/ 					return {
/******/ 						type: "self-declined",
/******/ 						chain: chain,
/******/ 						moduleId: moduleId
/******/ 					};
/******/ 				}
/******/ 				if (module.hot._main) {
/******/ 					return {
/******/ 						type: "unaccepted",
/******/ 						chain: chain,
/******/ 						moduleId: moduleId
/******/ 					};
/******/ 				}
/******/ 				for (var i = 0; i < module.parents.length; i++) {
/******/ 					var parentId = module.parents[i];
/******/ 					var parent = installedModules[parentId];
/******/ 					if (!parent) continue;
/******/ 					if (parent.hot._declinedDependencies[moduleId]) {
/******/ 						return {
/******/ 							type: "declined",
/******/ 							chain: chain.concat([parentId]),
/******/ 							moduleId: moduleId,
/******/ 							parentId: parentId
/******/ 						};
/******/ 					}
/******/ 					if (outdatedModules.indexOf(parentId) !== -1) continue;
/******/ 					if (parent.hot._acceptedDependencies[moduleId]) {
/******/ 						if (!outdatedDependencies[parentId])
/******/ 							outdatedDependencies[parentId] = [];
/******/ 						addAllToSet(outdatedDependencies[parentId], [moduleId]);
/******/ 						continue;
/******/ 					}
/******/ 					delete outdatedDependencies[parentId];
/******/ 					outdatedModules.push(parentId);
/******/ 					queue.push({
/******/ 						chain: chain.concat([parentId]),
/******/ 						id: parentId
/******/ 					});
/******/ 				}
/******/ 			}
/******/
/******/ 			return {
/******/ 				type: "accepted",
/******/ 				moduleId: updateModuleId,
/******/ 				outdatedModules: outdatedModules,
/******/ 				outdatedDependencies: outdatedDependencies
/******/ 			};
/******/ 		}
/******/
/******/ 		function addAllToSet(a, b) {
/******/ 			for (var i = 0; i < b.length; i++) {
/******/ 				var item = b[i];
/******/ 				if (a.indexOf(item) === -1) a.push(item);
/******/ 			}
/******/ 		}
/******/
/******/ 		// at begin all updates modules are outdated
/******/ 		// the "outdated" status can propagate to parents if they don't accept the children
/******/ 		var outdatedDependencies = {};
/******/ 		var outdatedModules = [];
/******/ 		var appliedUpdate = {};
/******/
/******/ 		var warnUnexpectedRequire = function warnUnexpectedRequire() {
/******/ 			console.warn(
/******/ 				"[HMR] unexpected require(" + result.moduleId + ") to disposed module"
/******/ 			);
/******/ 		};
/******/
/******/ 		for (var id in hotUpdate) {
/******/ 			if (Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 				moduleId = toModuleId(id);
/******/ 				var result;
/******/ 				if (hotUpdate[id]) {
/******/ 					result = getAffectedStuff(moduleId);
/******/ 				} else {
/******/ 					result = {
/******/ 						type: "disposed",
/******/ 						moduleId: id
/******/ 					};
/******/ 				}
/******/ 				var abortError = false;
/******/ 				var doApply = false;
/******/ 				var doDispose = false;
/******/ 				var chainInfo = "";
/******/ 				if (result.chain) {
/******/ 					chainInfo = "\nUpdate propagation: " + result.chain.join(" -> ");
/******/ 				}
/******/ 				switch (result.type) {
/******/ 					case "self-declined":
/******/ 						if (options.onDeclined) options.onDeclined(result);
/******/ 						if (!options.ignoreDeclined)
/******/ 							abortError = new Error(
/******/ 								"Aborted because of self decline: " +
/******/ 									result.moduleId +
/******/ 									chainInfo
/******/ 							);
/******/ 						break;
/******/ 					case "declined":
/******/ 						if (options.onDeclined) options.onDeclined(result);
/******/ 						if (!options.ignoreDeclined)
/******/ 							abortError = new Error(
/******/ 								"Aborted because of declined dependency: " +
/******/ 									result.moduleId +
/******/ 									" in " +
/******/ 									result.parentId +
/******/ 									chainInfo
/******/ 							);
/******/ 						break;
/******/ 					case "unaccepted":
/******/ 						if (options.onUnaccepted) options.onUnaccepted(result);
/******/ 						if (!options.ignoreUnaccepted)
/******/ 							abortError = new Error(
/******/ 								"Aborted because " + moduleId + " is not accepted" + chainInfo
/******/ 							);
/******/ 						break;
/******/ 					case "accepted":
/******/ 						if (options.onAccepted) options.onAccepted(result);
/******/ 						doApply = true;
/******/ 						break;
/******/ 					case "disposed":
/******/ 						if (options.onDisposed) options.onDisposed(result);
/******/ 						doDispose = true;
/******/ 						break;
/******/ 					default:
/******/ 						throw new Error("Unexception type " + result.type);
/******/ 				}
/******/ 				if (abortError) {
/******/ 					hotSetStatus("abort");
/******/ 					return Promise.reject(abortError);
/******/ 				}
/******/ 				if (doApply) {
/******/ 					appliedUpdate[moduleId] = hotUpdate[moduleId];
/******/ 					addAllToSet(outdatedModules, result.outdatedModules);
/******/ 					for (moduleId in result.outdatedDependencies) {
/******/ 						if (
/******/ 							Object.prototype.hasOwnProperty.call(
/******/ 								result.outdatedDependencies,
/******/ 								moduleId
/******/ 							)
/******/ 						) {
/******/ 							if (!outdatedDependencies[moduleId])
/******/ 								outdatedDependencies[moduleId] = [];
/******/ 							addAllToSet(
/******/ 								outdatedDependencies[moduleId],
/******/ 								result.outdatedDependencies[moduleId]
/******/ 							);
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 				if (doDispose) {
/******/ 					addAllToSet(outdatedModules, [result.moduleId]);
/******/ 					appliedUpdate[moduleId] = warnUnexpectedRequire;
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// Store self accepted outdated modules to require them later by the module system
/******/ 		var outdatedSelfAcceptedModules = [];
/******/ 		for (i = 0; i < outdatedModules.length; i++) {
/******/ 			moduleId = outdatedModules[i];
/******/ 			if (
/******/ 				installedModules[moduleId] &&
/******/ 				installedModules[moduleId].hot._selfAccepted
/******/ 			)
/******/ 				outdatedSelfAcceptedModules.push({
/******/ 					module: moduleId,
/******/ 					errorHandler: installedModules[moduleId].hot._selfAccepted
/******/ 				});
/******/ 		}
/******/
/******/ 		// Now in "dispose" phase
/******/ 		hotSetStatus("dispose");
/******/ 		Object.keys(hotAvailableFilesMap).forEach(function(chunkId) {
/******/ 			if (hotAvailableFilesMap[chunkId] === false) {
/******/ 				hotDisposeChunk(chunkId);
/******/ 			}
/******/ 		});
/******/
/******/ 		var idx;
/******/ 		var queue = outdatedModules.slice();
/******/ 		while (queue.length > 0) {
/******/ 			moduleId = queue.pop();
/******/ 			module = installedModules[moduleId];
/******/ 			if (!module) continue;
/******/
/******/ 			var data = {};
/******/
/******/ 			// Call dispose handlers
/******/ 			var disposeHandlers = module.hot._disposeHandlers;
/******/ 			for (j = 0; j < disposeHandlers.length; j++) {
/******/ 				cb = disposeHandlers[j];
/******/ 				cb(data);
/******/ 			}
/******/ 			hotCurrentModuleData[moduleId] = data;
/******/
/******/ 			// disable module (this disables requires from this module)
/******/ 			module.hot.active = false;
/******/
/******/ 			// remove module from cache
/******/ 			delete installedModules[moduleId];
/******/
/******/ 			// when disposing there is no need to call dispose handler
/******/ 			delete outdatedDependencies[moduleId];
/******/
/******/ 			// remove "parents" references from all children
/******/ 			for (j = 0; j < module.children.length; j++) {
/******/ 				var child = installedModules[module.children[j]];
/******/ 				if (!child) continue;
/******/ 				idx = child.parents.indexOf(moduleId);
/******/ 				if (idx >= 0) {
/******/ 					child.parents.splice(idx, 1);
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// remove outdated dependency from module children
/******/ 		var dependency;
/******/ 		var moduleOutdatedDependencies;
/******/ 		for (moduleId in outdatedDependencies) {
/******/ 			if (
/******/ 				Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)
/******/ 			) {
/******/ 				module = installedModules[moduleId];
/******/ 				if (module) {
/******/ 					moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 					for (j = 0; j < moduleOutdatedDependencies.length; j++) {
/******/ 						dependency = moduleOutdatedDependencies[j];
/******/ 						idx = module.children.indexOf(dependency);
/******/ 						if (idx >= 0) module.children.splice(idx, 1);
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// Not in "apply" phase
/******/ 		hotSetStatus("apply");
/******/
/******/ 		hotCurrentHash = hotUpdateNewHash;
/******/
/******/ 		// insert new code
/******/ 		for (moduleId in appliedUpdate) {
/******/ 			if (Object.prototype.hasOwnProperty.call(appliedUpdate, moduleId)) {
/******/ 				modules[moduleId] = appliedUpdate[moduleId];
/******/ 			}
/******/ 		}
/******/
/******/ 		// call accept handlers
/******/ 		var error = null;
/******/ 		for (moduleId in outdatedDependencies) {
/******/ 			if (
/******/ 				Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)
/******/ 			) {
/******/ 				module = installedModules[moduleId];
/******/ 				if (module) {
/******/ 					moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 					var callbacks = [];
/******/ 					for (i = 0; i < moduleOutdatedDependencies.length; i++) {
/******/ 						dependency = moduleOutdatedDependencies[i];
/******/ 						cb = module.hot._acceptedDependencies[dependency];
/******/ 						if (cb) {
/******/ 							if (callbacks.indexOf(cb) !== -1) continue;
/******/ 							callbacks.push(cb);
/******/ 						}
/******/ 					}
/******/ 					for (i = 0; i < callbacks.length; i++) {
/******/ 						cb = callbacks[i];
/******/ 						try {
/******/ 							cb(moduleOutdatedDependencies);
/******/ 						} catch (err) {
/******/ 							if (options.onErrored) {
/******/ 								options.onErrored({
/******/ 									type: "accept-errored",
/******/ 									moduleId: moduleId,
/******/ 									dependencyId: moduleOutdatedDependencies[i],
/******/ 									error: err
/******/ 								});
/******/ 							}
/******/ 							if (!options.ignoreErrored) {
/******/ 								if (!error) error = err;
/******/ 							}
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// Load self accepted modules
/******/ 		for (i = 0; i < outdatedSelfAcceptedModules.length; i++) {
/******/ 			var item = outdatedSelfAcceptedModules[i];
/******/ 			moduleId = item.module;
/******/ 			hotCurrentParents = [moduleId];
/******/ 			try {
/******/ 				__webpack_require__(moduleId);
/******/ 			} catch (err) {
/******/ 				if (typeof item.errorHandler === "function") {
/******/ 					try {
/******/ 						item.errorHandler(err);
/******/ 					} catch (err2) {
/******/ 						if (options.onErrored) {
/******/ 							options.onErrored({
/******/ 								type: "self-accept-error-handler-errored",
/******/ 								moduleId: moduleId,
/******/ 								error: err2,
/******/ 								originalError: err
/******/ 							});
/******/ 						}
/******/ 						if (!options.ignoreErrored) {
/******/ 							if (!error) error = err2;
/******/ 						}
/******/ 						if (!error) error = err;
/******/ 					}
/******/ 				} else {
/******/ 					if (options.onErrored) {
/******/ 						options.onErrored({
/******/ 							type: "self-accept-errored",
/******/ 							moduleId: moduleId,
/******/ 							error: err
/******/ 						});
/******/ 					}
/******/ 					if (!options.ignoreErrored) {
/******/ 						if (!error) error = err;
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// handle errors in accept handlers and self accepted module load
/******/ 		if (error) {
/******/ 			hotSetStatus("fail");
/******/ 			return Promise.reject(error);
/******/ 		}
/******/
/******/ 		hotSetStatus("idle");
/******/ 		return new Promise(function(resolve) {
/******/ 			resolve(outdatedModules);
/******/ 		});
/******/ 	}
/******/
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {},
/******/ 			hot: hotCreateModule(moduleId),
/******/ 			parents: (hotCurrentParentsTemp = hotCurrentParents, hotCurrentParents = [], hotCurrentParentsTemp),
/******/ 			children: []
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, hotCreateRequire(moduleId));
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// __webpack_hash__
/******/ 	__webpack_require__.h = function() { return hotCurrentHash; };
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return hotCreateRequire(0)(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ({

/***/ "./demo/App.js":
/*!*********************!*\
  !*** ./demo/App.js ***!
  \*********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _reacting = __webpack_require__(/*! ./reacting */ "./demo/reacting.js");

var _reacting2 = _interopRequireDefault(_reacting);

var _Home = __webpack_require__(/*! ./container/Home */ "./demo/container/Home.js");

var _Home2 = _interopRequireDefault(_Home);

var _Header = __webpack_require__(/*! ./container/Header */ "./demo/container/Header.js");

var _Header2 = _interopRequireDefault(_Header);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } // import React from 'react';

// import React from 'luy';

var App = function (_React$Component) {
    _inherits(App, _React$Component);

    function App() {
        _classCallCheck(this, App);

        return _possibleConstructorReturn(this, (App.__proto__ || Object.getPrototypeOf(App)).apply(this, arguments));
    }

    _createClass(App, [{
        key: 'render',
        value: function render() {

            return _reacting2.default.createElement(
                'div',
                null,
                _reacting2.default.createElement(
                    'h3',
                    null,
                    'Welcome to App Page.'
                ),
                _reacting2.default.createElement(_Header2.default, null),
                _reacting2.default.createElement(_Home2.default, null)
            );
        }
    }]);

    return App;
}(_reacting2.default.Component);

exports.default = App;

/***/ }),

/***/ "./demo/component/PlotBoard.js":
/*!*************************************!*\
  !*** ./demo/component/PlotBoard.js ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _reacting = __webpack_require__(/*! ../reacting */ "./demo/reacting.js");

var _reacting2 = _interopRequireDefault(_reacting);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } // import React from 'react';


// import React from 'luy';

var PlotBoard = function (_React$Component) {
    _inherits(PlotBoard, _React$Component);

    function PlotBoard() {
        _classCallCheck(this, PlotBoard);

        return _possibleConstructorReturn(this, (PlotBoard.__proto__ || Object.getPrototypeOf(PlotBoard)).apply(this, arguments));
    }

    _createClass(PlotBoard, [{
        key: 'render',


        // constructor() {
        //     super();
        //     this.state = {
        //         headerMenu: ['饼状图', '折线图', '条形图', '其他图'],
        //     }
        // }

        value: function render() {
            var boardData = this.props.boardData;

            var styleBoard = {
                width: '480',
                height: '320',
                backgroundColor: '#eee',
                float: 'left',
                textAlign: 'center',
                margin: '6 24'
            };

            return _reacting2.default.createElement(
                'div',
                null,
                boardData.map(function (item, i) {
                    return _reacting2.default.createElement(
                        'div',
                        { key: i, style: styleBoard },
                        _reacting2.default.createElement(
                            'h2',
                            null,
                            item
                        )
                    );
                })
            );
        }
    }]);

    return PlotBoard;
}(_reacting2.default.Component);

exports.default = PlotBoard;

/***/ }),

/***/ "./demo/container/Header.js":
/*!**********************************!*\
  !*** ./demo/container/Header.js ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _reacting = __webpack_require__(/*! ../reacting */ "./demo/reacting.js");

var _reacting2 = _interopRequireDefault(_reacting);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } // import React from 'react';


// import React from 'luy';

var Header = function (_React$Component) {
    _inherits(Header, _React$Component);

    function Header() {
        _classCallCheck(this, Header);

        var _this = _possibleConstructorReturn(this, (Header.__proto__ || Object.getPrototypeOf(Header)).call(this));

        _this.state = {
            headerMenu: ['饼状图', '折线图', '条形图', '散点图', '其他图']
        };
        return _this;
    }

    _createClass(Header, [{
        key: 'render',
        value: function render() {
            var headerMenu = this.state.headerMenu;

            var styleBtn = {
                // width: '72px',
                // height: '36px',
                padding: '12 36',
                margin: '8 24',
                color: '#fff',
                backgroundColor: '#777',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '1.1rem'

            };
            return _reacting2.default.createElement(
                'div',
                null,
                headerMenu.map(function (item, i) {
                    return _reacting2.default.createElement(
                        'button',
                        { style: styleBtn, key: i, type: 'button' },
                        item
                    );
                })
            );
        }
    }]);

    return Header;
}(_reacting2.default.Component);

exports.default = Header;

/***/ }),

/***/ "./demo/container/Home.js":
/*!********************************!*\
  !*** ./demo/container/Home.js ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _reacting = __webpack_require__(/*! ../reacting */ "./demo/reacting.js");

var _reacting2 = _interopRequireDefault(_reacting);

var _PlotBoard = __webpack_require__(/*! ../component/PlotBoard */ "./demo/component/PlotBoard.js");

var _PlotBoard2 = _interopRequireDefault(_PlotBoard);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } // import React from 'react';

// import React from 'luy';

var Home = function (_React$Component) {
    _inherits(Home, _React$Component);

    function Home() {
        _classCallCheck(this, Home);

        var _this = _possibleConstructorReturn(this, (Home.__proto__ || Object.getPrototypeOf(Home)).call(this));

        _this.state = {
            boardData: ['aa', 'bb', 'cc', 'dd', 'ee', 'ff', 'gg', 'hh', 'iii', 'jj']
        };
        return _this;
    }

    _createClass(Home, [{
        key: 'render',
        value: function render() {
            var boardData = this.state.boardData;

            return _reacting2.default.createElement(
                'div',
                null,
                _reacting2.default.createElement(_PlotBoard2.default, { boardData: boardData })
            );
        }
    }]);

    return Home;
}(_reacting2.default.Component);

exports.default = Home;

/***/ }),

/***/ "./demo/index.js":
/*!***********************!*\
  !*** ./demo/index.js ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _reacting = __webpack_require__(/*! ./reacting */ "./demo/reacting.js");

var _reacting2 = _interopRequireDefault(_reacting);

var _App = __webpack_require__(/*! ./App */ "./demo/App.js");

var _App2 = _interopRequireDefault(_App);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_reacting2.default.render(_reacting2.default.createElement(_App2.default, null), document.getElementById('root')); // import React from 'react';
// import ReactDOM from 'react-dom';

/***/ }),

/***/ "./demo/reacting.js":
/*!**************************!*\
  !*** ./demo/reacting.js ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _src = __webpack_require__(/*! ../src */ "./src/index.js");

var _src2 = _interopRequireDefault(_src);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _src2.default; // export default  React from '../src';

// import React from '../build/reacting';

/***/ }),

/***/ "./src/children.js":
/*!*************************!*\
  !*** ./src/children.js ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Children = undefined;

var _createElement = __webpack_require__(/*! ./createElement */ "./src/createElement.js");

var _utils = __webpack_require__(/*! ./utils */ "./src/utils.js");

var Children = {
    //context不是组件的context而是组件上下文
    map: function map(childVnode, callback, context) {
        if (childVnode === null || childVnode === undefined) {
            return [childVnode];
        }
        if ((0, _utils.typeNumber)(childVnode) !== 7) {
            return [callback.call(context, childVnode, 0)];
        }

        var ret = [];
        (0, _createElement.flattenChildren)(childVnode).forEach(function (oldVnode, index) {
            var newVnode = callback.call(context, oldVnode, index);
            if (newVnode === null) {
                return;
            }
            ret.push(newVnode);
        });
        return ret;
    },
    only: function only(childVnode) {
        if ((0, _utils.typeNumber)(childVnode) !== 7) {
            return childVnode;
        }
        throw new Error("React.Children.only expect only one child, which means you cannot use a list inside a component");
    },
    count: function count(childVnode) {
        if (childVnode === null) {
            return 0;
        }
        if ((0, _utils.typeNumber)(childVnode) !== 7) {
            return 1;
        }
        return (0, _createElement.flattenChildren)(childVnode).length;
    },
    forEach: function forEach(childVnode, callback, context) {
        var flatten = (0, _createElement.flattenChildren)(childVnode);

        if ((0, _utils.typeNumber)(flatten) === 7) {
            (0, _createElement.flattenChildren)(childVnode).forEach(callback, context);
        } else {
            callback.call(context, childVnode, 0);
        }
    },


    toArray: function toArray(childVnode) {
        if (childVnode == null) {
            return [];
        }
        return Children.map(childVnode, function (el) {
            return el;
        });
    }

};

exports.Children = Children;

/***/ }),

/***/ "./src/cloneElement.js":
/*!*****************************!*\
  !*** ./src/cloneElement.js ***!
  \*****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.cloneElement = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createElement = __webpack_require__(/*! ./createElement */ "./src/createElement.js");

function cloneElement(vnode, props) {

    var config = {},
        children = void 0;

    for (var propName in vnode.props) {
        if (propName === 'children') {
            children = vnode.props[propName];
        } else {
            config[propName] = vnode.props[propName];
        }
    }

    config = _extends({}, config, props);

    var newKey = props.key ? props.key : vnode.key;
    var newRef = props.ref ? props.ref : vnode.ref;
    config['key'] = newKey;
    config['ref'] = newRef;

    return (0, _createElement.createElement)(vnode.type, config, children);
}

exports.cloneElement = cloneElement;

/***/ }),

/***/ "./src/component.js":
/*!**************************!*\
  !*** ./src/component.js ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ReactClass = exports.Com = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _vdom = __webpack_require__(/*! ./vdom */ "./src/vdom.js");

var _utils = __webpack_require__(/*! ./utils */ "./src/utils.js");

var _createElement = __webpack_require__(/*! ./createElement */ "./src/createElement.js");

var _errorBoundary = __webpack_require__(/*! ./errorBoundary */ "./src/errorBoundary.js");

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Com = exports.Com = {
  CREATE: 0, //创造节点
  MOUNT: 1, //节点已经挂载
  UPDATING: 2, //节点正在更新
  UPDATED: 3, //节点已经更新
  MOUNTTING: 4, //节点正在挂载,
  CATCHING: 5
};

var uniqueId = 0;
// 用户用来继承的 Component 类

var ReactClass = function () {
  function ReactClass(props, context) {
    _classCallCheck(this, ReactClass);

    this.props = props;
    this.context = context;
    this.state = this.state || {};

    this.nextState = null;
    this._renderCallbacks = [];
    this.lifeCycle = Com.CREATE;
    this.stateMergeQueue = [];
    this._penddingState = [];
    this.refs = {};
    this._uniqueId = uniqueId;
    uniqueId++;
  }

  _createClass(ReactClass, [{
    key: 'updateComponent',
    value: function updateComponent() {
      var _this = this;

      var prevState = this.state;
      var oldVnode = this.Vnode;
      var oldContext = this.context;

      this.nextState = this.state;
      for (var index in this._penddingState) {
        var item = this._penddingState[index];
        if (typeof item.partialNewState === 'function') {
          this.nextState = Object.assign({}, this.nextState, item.partialNewState(this.nextState, this.props));
        } else {
          this.nextState = Object.assign({}, this.state, item.partialNewState);
        }
      }

      if (this.nextState !== prevState) {
        this.state = this.nextState;
      }
      if (this.getChildContext) {
        this.context = (0, _utils.extend)((0, _utils.extend)({}, this.context), this.getChildContext());
      }

      if (this.componentWillUpdate) {
        (0, _errorBoundary.catchError)(this, 'componentWillUpdate', [this.props, this.nextState, this.context]);
      }

      var lastOwner = _vdom.currentOwner.cur;
      _vdom.currentOwner.cur = this;
      this.nextState = null;
      var newVnode = this.render();

      newVnode = newVnode ? newVnode : new _createElement.Vnode('#text', "", null, null);
      _vdom.currentOwner.cur = lastOwner;
      this.Vnode = (0, _vdom.update)(oldVnode, newVnode, this.Vnode._hostNode, this.context); //这个函数返回一个更新后的Vnode

      if (this.componentDidUpdate) {
        (0, _errorBoundary.catchError)(this, 'componentDidUpdate', [this.props, prevState, oldContext]);
      }

      this._penddingState.forEach(function (item) {
        if (typeof item.callback === 'function') {
          item.callback(_this.state, _this.props);
        }
      });

      this._penddingState = [];
    }
  }, {
    key: '_updateInLifeCycle',
    value: function _updateInLifeCycle() {
      if (this.stateMergeQueue.length > 0) {
        var tempState = this.state;

        this._penddingState.forEach(function (item) {
          tempState = Object.assign.apply(Object, [{}, tempState].concat(_toConsumableArray(item.partialNewState)));
        });

        this.nextState = _extends({}, tempState);
        this.stateMergeQueue = [];
        this.updateComponent();
      }
    }

    /**
     * 事件触发的时候setState只会触发最后一个
     * 在componentdidmount的时候会全部合成
     * @param {*} partialNewState
     * @param {*} callback
     */

  }, {
    key: 'setState',
    value: function setState(partialNewState, callback) {

      this._penddingState.push({ partialNewState: partialNewState, callback: callback });

      if (this.shouldComponentUpdate) {
        var shouldUpdate = this.shouldComponentUpdate(this.props, this.nextState, this.context);
        if (!shouldUpdate) {
          return;
        }
      }

      if (this.lifeCycle === Com.CREATE) {
        //组件挂载期

      } else {
        //组件更新期
        if (this.lifeCycle === Com.UPDATING) {
          return;
        }

        if (this.lifeCycle === Com.MOUNTTING) {
          //componentDidMount的时候调用setState
          this.stateMergeQueue.push(1);
          return;
        }

        if (this.lifeCycle === Com.CATCHING) {
          //componentDidMount的时候调用setState
          this.stateMergeQueue.push(1);
          return;
        }

        if (_utils.options.async === true) {
          //事件中调用
          var dirty = _utils.options.dirtyComponent[this._uniqueId];
          if (!dirty) {
            _utils.options.dirtyComponent[this._uniqueId] = this;
          }
          return;
        }

        //不在生命周期中调用，有可能是异步调用
        this.updateComponent();
      }
    }

    // shouldComponentUpdate() { }

  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps() {}
    // componentWillUpdate() { }
    // componentDidUpdate() { }

  }, {
    key: 'componentWillMount',
    value: function componentWillMount() {}
  }, {
    key: 'componentDidMount',
    value: function componentDidMount() {}
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {}
  }, {
    key: 'componentDidUnmount',
    value: function componentDidUnmount() {}
  }, {
    key: 'render',
    value: function render() {}
  }]);

  return ReactClass;
}();

exports.ReactClass = ReactClass;

/***/ }),

/***/ "./src/controlledComponent.js":
/*!************************************!*\
  !*** ./src/controlledComponent.js ***!
  \************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
var controllProps = {
    color: 1,
    date: 1,
    datetime: 1,
    "datetime-local": 1,
    email: 1,
    month: 1,
    number: 1,
    password: 1,
    range: 1,
    search: 1,
    tel: 1,
    text: 1,
    time: 1,
    url: 1,
    week: 1,
    textarea: 1,
    checkbox: 2,
    radio: 2,
    "select-one": 3,
    "select-multiple": 3
};

var controllData = {
    1: ["value", {
        onChange: 1,
        onInput: 1,
        readOnly: 1,
        disabled: 1
    }, "oninput", preventUserInput],
    2: ["checked", {
        onChange: 1,
        onClick: 1,
        readOnly: 1,
        disabled: 1
    }, "onclick", preventUserClick],
    3: ["value", {
        onChange: 1,
        disabled: 1
    }, "onchange", preventUserChange]
};

var mapControlledElement = function mapControlledElement(domNode, props) {
    var type = domNode.type;
    var controllType = controllProps[type];
    if (controllType) {
        var data = controllData[controllType]; //1.input 2.带有check的input 3.select
        var controllProp = data[0]; //value --- input,check---input,value---select
        var otherProps = data[1]; //如果元素定义了这些属性，那么就是受控属性，否则非受控
        var event = data[2]; //每一种元素对应的防止用户输入的方法

        if (controllProp in props && !hasOtherControllProperty(props, otherProps)) {
            console.warn("\u4F60\u4E3A" + domNode.nodeName + "[type=" + type + "]\u5143\u7D20\u6307\u5B9A\u4E86" + controllProp + "\u5C5E\u6027\uFF0C\n            \u4F46\u662F\u6CA1\u6709\u63D0\u4F9B\u53E6\u5916\u7684" + Object.keys(otherProps) + "\u6765\u63A7\u5236" + controllProp + "\u5C5E\u6027\u7684\u53D8\u5316\n            \u90A3\u4E48\u5B83\u5373\u4E3A\u4E00\u4E2A\u975E\u53D7\u63A7\u7EC4\u4EF6\uFF0C\u7528\u6237\u65E0\u6CD5\u901A\u8FC7\u8F93\u5165\u6539\u53D8\u5143\u7D20\u7684" + controllProp + "\u503C");

            domNode._lastValue = props[controllProp];
            domNode[event] = data[3];
        } else {}
    }
};

function hasOtherControllProperty(props, otherProps) {
    for (var key in props) {
        if (otherProps[key]) {
            return true;
        }
    }
}

function preventUserInput(e) {
    var target = e.target;
    var name = e.type === 'textarea' ? 'innerHTML' : 'value'; //如果是textarea，他的输入保存在innerHTML里
    target[name] = target._lastValue;
}

function preventUserChange(e) {
    var target = e.target,
        value = target._lastValue,
        options = target.options;
    if (target.multiple) {} else {
        updateOptionsOne(options, options.length, value);
    }
}
function preventUserClick(e) {
    e.preventDefault();
}

function updateOptionsOne(options, length, lastValue) {
    var stringValues = {};
    console.log(options);
    for (var i = 0; i < length; i++) {
        var option = options[i];
        var value = option.value;
        if (value === lastValue) {
            option.selected = true;
            return;
        }
    }
    if (length) {
        //选中第一个
        options[0].selected = true;
    }
}

function updateOptionsMore(options, length, lastValue) {
    var selectedValue = {};
    try {
        for (var i = 0; i < lastValue.length; i++) {
            selectedValue["&" + lastValue[i]] = true;
        }
    } catch (e) {
        /* istanbul ignore next */
        console.warn('<select multiple="true"> 的value应该对应一个字符串数组');
    }
    for (var _i = 0; _i < n; _i++) {
        var option = options[_i];
        var value = option.value;
        var selected = selectedValue.hasOwnProperty("&" + value);
        option.selected = selected;
    }
}

exports.mapControlledElement = mapControlledElement;

/***/ }),

/***/ "./src/createElement.js":
/*!******************************!*\
  !*** ./src/createElement.js ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Vnode = exports.createElement = undefined;
exports.flattenChildren = flattenChildren;

var _utils = __webpack_require__(/*! ./utils */ "./src/utils.js");

var _vdom = __webpack_require__(/*! ./vdom */ "./src/vdom.js");

var RESERVED_PROPS = {
    ref: true,
    key: true,
    __self: true,
    __source: true
};

function Vnode(type, props, key, ref) {
    this.owner = _vdom.currentOwner.cur;
    this.type = type;
    this.props = props;
    this.key = key;
    this.ref = ref;
}

/**
 * 创建虚拟Dom的地方
 * @param {string | Function} type
 * @param {object} config
 * @param {array} children
 */
function createElement(type, config) {
    for (var _len = arguments.length, children = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
        children[_key - 2] = arguments[_key];
    }

    var props = {},
        key = null,
        ref = null,
        childLength = children.length;

    if (config != null) {
        //巧妙的将key转化为字符串
        key = config.key === undefined ? null : '' + config.key;
        ref = config.ref === undefined ? null : config.ref;

        /**这一步讲外部的prop属性放进prop里 */
        for (var propName in config) {
            // 除去一些不需要的属性,key,ref等
            if (RESERVED_PROPS.hasOwnProperty(propName)) continue;
            //保证所有的属性都不是undefined
            if (config.hasOwnProperty(propName)) {
                props[propName] = config[propName];
            }
        }
    }

    if (childLength === 1) {
        props.children = (0, _utils.typeNumber)(children[0]) > 2 ? children[0] : [];
    } else if (childLength > 1) {
        props.children = children;
    }

    /**设置defaultProps */
    var defaultProps = type.defaultProps;
    if (defaultProps) {
        for (var _propName in defaultProps) {
            if (props[_propName] === undefined) {
                props[_propName] = defaultProps[_propName];
            }
        }
    }

    return new Vnode(type, props, key, ref);
}

/**
 * 实际上这里做的事情就是将文字节点全部转换成Vnode
 * @param {*} children
 */
function flattenChildren(children, parentVnode) {

    if (children === undefined) return new Vnode('#text', "", null, null);

    var length = children.length;
    var ary = [],
        isLastSimple = false,
        //判断上一个元素是否是string 或者 number
    lastString = '',
        childType = (0, _utils.typeNumber)(children);

    if (childType === 4 || childType === 3) {
        return new Vnode('#text', children, null, null);
    }

    if (childType !== 7) {
        if (parentVnode) children.return = parentVnode;
        return children;
    }

    children.forEach(function (item, index) {
        if ((0, _utils.typeNumber)(item) === 7) {
            if (isLastSimple) {
                ary.push(lastString);
            }
            item.forEach(function (item) {
                ary.push(item);
            });
            lastString = '';
            isLastSimple = false;
        }
        if ((0, _utils.typeNumber)(item) === 3 || (0, _utils.typeNumber)(item) === 4) {
            lastString += item;
            isLastSimple = true;
        }
        if ((0, _utils.typeNumber)(item) !== 3 && (0, _utils.typeNumber)(item) !== 4 && (0, _utils.typeNumber)(item) !== 7) {
            if (isLastSimple) {
                //上一个节点是简单节点
                ary.push(lastString);
                ary.push(item);
                lastString = '';
                isLastSimple = false;
            } else {
                ary.push(item);
            }
        }
        if (length - 1 === index) {
            if (lastString) ary.push(lastString);
        }
    });
    ary = ary.map(function (item) {
        if ((0, _utils.typeNumber)(item) === 4) {
            item = new Vnode('#text', item, null, null);
        } else {
            if (item) {
                //首先判断是否存在
                if ((0, _utils.typeNumber)(item) !== 3 && (0, _utils.typeNumber)(item) !== 4) {
                    //再判断是不是字符串，或者数字
                    //不是就加上return
                    if (parentVnode) item.return = parentVnode;
                }
            }
        }
        return item;
    });

    return ary;
}

exports.createElement = createElement;
exports.Vnode = Vnode;

/***/ }),

/***/ "./src/dispose.js":
/*!************************!*\
  !*** ./src/dispose.js ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.disposeVnode = undefined;

var _utils = __webpack_require__(/*! ./utils */ "./src/utils.js");

var _refs = __webpack_require__(/*! ./refs */ "./src/refs.js");

var _errorBoundary = __webpack_require__(/*! ./errorBoundary */ "./src/errorBoundary.js");

function disposeVnode(Vnode) {
    //主要用于删除Vnode对应的节点
    var type = Vnode.type,
        props = Vnode.props;

    if ((0, _utils.typeNumber)(Vnode) === 7) {
        disposeChildVnode(Vnode);
        return;
    }

    if (!type) return;
    // clearEvents(Vnode._hostNode, props, Vnode);
    if (typeof Vnode.type === 'function') {
        if (Vnode._instance.componentWillUnmount) {
            (0, _errorBoundary.catchError)(Vnode._instance, 'componentWillUnmount', []);
        }

        (0, _refs.clearRefs)(Vnode._instance.ref);
    }
    if (Vnode.props.children) {
        disposeChildVnode(Vnode.props.children);
    }
    if (Vnode._PortalHostNode) {
        var parent = Vnode._PortalHostNode.parentNode;
        parent.removeChild(Vnode._PortalHostNode);
    } else {
        if (Vnode._hostNode) {
            //有可能会出现undefind的情况
            var _parent = Vnode._hostNode.parentNode;
            if (_parent) _parent.removeChild(Vnode._hostNode);
        }
    }
    Vnode._hostNode = null;
}

function disposeChildVnode(childVnode) {
    var children = childVnode;
    if ((0, _utils.typeNumber)(children) !== 7) children = [children];
    children.forEach(function (child) {
        if (typeof child.type === 'function') {
            if ((0, _utils.typeNumber)(child._hostNode) <= 1) {
                child._hostNode = null;
                child._instance = null;
                return; //证明这个节点已经北删除
            }

            if (child._instance.componentWillUnmount) {
                (0, _errorBoundary.catchError)(child._instance, 'componentWillUnmount', []);
            }
        }
        if ((0, _utils.typeNumber)(child) !== 4 && (0, _utils.typeNumber)(child) !== 3 && child._hostNode !== void 666) {
            // clearEvents(child._hostNode, child.props, child);
            var parent = child._hostNode.parentNode;
            parent.removeChild(child._hostNode);
            child._hostNode = null;
            child._instance = null;
            if (child.props.children) {
                disposeChildVnode(child.props.children);
            }
        }
    });
}

exports.disposeVnode = disposeVnode;

/***/ }),

/***/ "./src/errorBoundary.js":
/*!******************************!*\
  !*** ./src/errorBoundary.js ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.runException = exports.collectErrorVnode = exports.getReturn = exports.catchError = exports.globalError = undefined;

var _dispose = __webpack_require__(/*! ./dispose */ "./src/dispose.js");

var _utils = __webpack_require__(/*! ./utils */ "./src/utils.js");

var _component = __webpack_require__(/*! ./component */ "./src/component.js");

var _errorVnode = [];
var V_Instance = [];
var errorMsg = '';
var globalError = exports.globalError = undefined;

/**
 * 捕捉错误的核心代码，错误只会发生在用户事件回调，ref，setState回调，生命周期函数
 * @param {*} Instance 需要捕捉的虚拟组件实例
 * @param {*} hookname 用户事件回调，ref，setState回调，生命周期函数
 * @param {*} args 参数
 */
function catchError(Instance, hookname, args) {
    try {
        if (Instance[hookname]) {
            var resulte = void 666;
            if (hookname === 'render') {
                resulte = Instance[hookname].apply(Instance);
            } else {
                resulte = Instance[hookname].apply(Instance, args);
            }
            return resulte;
        }
    } catch (e) {
        // throw new Error(e);
        // disposeVnode(Instance.Vnode);
        var Vnode = void 666;
        Vnode = Instance.Vnode;
        if (hookname === 'render' || hookname === 'componentWillMount') {
            Vnode = args[0];
        }
        collectErrorVnode(e, Vnode, hookname);

        if (hookname !== 'render') return true;
    }
}

function getReturn(Vnode) {
    if (Vnode.return === void 666) {
        return Vnode;
    } else {
        if (Vnode.displayName === void 666) {
            return Vnode.return;
        } else {
            return Vnode;
        }
    }
}

function getName(Vnode, type) {
    var type_number = (0, _utils.typeNumber)(type);
    if (type_number === 4) {
        return type;
    }
    if (type_number === 5) {
        if (Vnode._hostNode) {
            return Vnode._hostNode.tagName;
        } else {
            return Vnode.type.name;
        }
    }
}

function pushErrorVnode(Vnode) {
    _errorVnode.push(Vnode);
}

function collectErrorVnode(error, _Vnode, hookname) {
    var Vnode = _Vnode === void 666 ? void 666 : _Vnode.return;
    var error_ary = [];
    do {
        if (Vnode === void 666) break;

        error_ary.push(Vnode);
        if (Vnode.return || Vnode.isTop === true) {
            try {
                errorMsg += 'in <' + (Vnode.displayName || getName(Vnode, Vnode.type)) + '/> created by ' + (Vnode.return.displayName || getName(Vnode.return, Vnode.return.type)) + '\n';
            } catch (e) {}
            if (Vnode._instance) {
                if (Vnode._instance.componentDidCatch) {
                    V_Instance.push({
                        instance: Vnode._instance,
                        componentDidCatch: Vnode._instance.componentDidCatch
                    });
                }
                // console.log(`<${Vnode.displayName || getName(Vnode, Vnode.type)}/> 拥有医生节点的能力`)
            }
        }
    } while (Vnode = Vnode.return);
    if (V_Instance.length === 0) {
        throw error;
    } else {
        exports.globalError = globalError = error;
    }
}

function runException() {
    var ins = V_Instance.shift();
    if (ins === void 666) {
        if (errorMsg !== '') {
            // console.warn(errorMsg)
        }
        return;
    }
    do {
        var _ins = ins,
            instance = _ins.instance,
            componentDidCatch = _ins.componentDidCatch;

        if (componentDidCatch) {
            try {
                instance.lifeCycle = _component.Com.CATCHING;
                componentDidCatch.call(instance, globalError, errorMsg);
                instance._updateInLifeCycle();
                break;
            } catch (e) {
                // if (instance.componentWillUnmount) {
                //     instance.componentWillUnmount();
                // }
                // disposeVnode(instance.Vnode);
                console.log(e, '多个错误发生，此处只处理一个错误');
            }
        } else {
            (0, _dispose.disposeVnode)(instance.Vnode);
        }
    } while (ins = V_Instance.shift());
}

exports.catchError = catchError;
exports.getReturn = getReturn;
exports.collectErrorVnode = collectErrorVnode;
exports.runException = runException;

/***/ }),

/***/ "./src/event.js":
/*!**********************!*\
  !*** ./src/event.js ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
/**事件合成，暂时这么写 */
function SyntheticEvent(event) {
    if (event.nativeEvent) {
        return event;
    }
    for (var i in event) {
        if (!eventProto[i]) {
            this[i] = event[i];
        }
    }
    if (!this.target) {
        this.target = event.srcElement;
    }
    this.fixEvent();
    this.timeStamp = new Date() - 0;
    this.nativeEvent = event;
}

var eventProto = SyntheticEvent.prototype = {
    fixEvent: function fixEvent() {}, //留给以后扩展用
    preventDefault: function preventDefault() {
        var e = this.nativeEvent || {};
        e.returnValue = this.returnValue = false;
        if (e.preventDefault) {
            e.preventDefault();
        }
    },
    fixHooks: function fixHooks() {},
    stopPropagation: function stopPropagation() {
        var e = this.nativeEvent || {};
        e.cancelBubble = this._stopPropagation = true;
        if (e.stopPropagation) {
            e.stopPropagation();
        }
    },
    persist: function noop() {},
    stopImmediatePropagation: function stopImmediatePropagation() {
        this.stopPropagation();
        this.stopImmediate = true;
    },
    toString: function toString() {
        return "[object Event]";
    }
};

exports.SyntheticEvent = SyntheticEvent;

/***/ }),

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.createElement = exports.Children = exports.Component = undefined;

var _createElement = __webpack_require__(/*! ./createElement */ "./src/createElement.js");

var _cloneElement = __webpack_require__(/*! ./cloneElement */ "./src/cloneElement.js");

var _children = __webpack_require__(/*! ./children */ "./src/children.js");

var _vdom = __webpack_require__(/*! ./vdom */ "./src/vdom.js");

var _component = __webpack_require__(/*! ./component */ "./src/component.js");

var React = {
    findDOMNode: _vdom.findDOMNode,
    // babel的默认设置是调用createElement这个函数
    createElement: _createElement.createElement,
    render: _vdom.render,
    cloneElement: _cloneElement.cloneElement,
    createPortal: _vdom.createPortal,
    Children: _children.Children,
    Component: _component.ReactClass
};

exports.Component = _component.ReactClass;
exports.Children = _children.Children;
exports.createElement = _createElement.createElement;
exports.default = React;

/***/ }),

/***/ "./src/mapProps.js":
/*!*************************!*\
  !*** ./src/mapProps.js ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.getEventPath = exports.mappingStrategy = exports.updateProps = exports.clearEvents = exports.mapProp = undefined;

var _utils = __webpack_require__(/*! ./utils */ "./src/utils.js");

var _event = __webpack_require__(/*! ./event */ "./src/event.js");

var _controlledComponent = __webpack_require__(/*! ./controlledComponent */ "./src/controlledComponent.js");

var formElement = {
    INPUT: true,
    SELECT: true,
    TEXTAREA: true
};

function isFormElement(domNode) {
    if (domNode) {
        return formElement[domNode.nodeName];
    }
}

function mapProp(domNode, props, Vnode) {
    if (Vnode && typeof Vnode.type === 'function') {
        //如果是组件，则不要map他的props进来
        return;
    }

    if (isFormElement(domNode)) {
        (0, _controlledComponent.mapControlledElement)(domNode, props);
    }
    for (var name in props) {
        if (name === 'children') continue;
        if ((0, _utils.isEventName)(name)) {
            var eventName = name.slice(2).toLowerCase(); //
            mappingStrategy['event'](domNode, props[name], eventName);
            continue;
        }
        if (typeof mappingStrategy[name] === 'function') {
            mappingStrategy[name](domNode, props[name]);
        }
        if (mappingStrategy[name] === undefined) {
            mappingStrategy['otherProps'](domNode, props[name], name);
        }
    }
}

function clearEvents(domNode, props, Vnode) {
    console.log(domNode);
    for (var name in props) {
        if (name === 'children') continue;
        if ((0, _utils.isEventName)(name)) {
            var eventName = name.slice(2).toLowerCase(); //
            mappingStrategy['clearEvents'](domNode, props[name], eventName);
            continue;
        }
    }
}

function updateProps(oldProps, newProps, hostNode) {
    for (var name in oldProps) {
        //修改原来有的属性
        if (name === 'children') continue;

        if (oldProps[name] !== newProps[name]) {
            mapProp(hostNode, newProps);
        }
    }

    var restProps = {};
    for (var newName in newProps) {
        //新增原来没有的属性
        if (oldProps[newName] === void 666) {
            restProps[newName] = newProps[newName];
        }
    }
    mapProp(hostNode, restProps);
}

var registerdEvent = {};
var controlledEvent = {
    change: 1,
    input: 1
};

function createHandle(e) {
    dispatchEvent(e, 'change');
}

var specialHook = {
    //react将text,textarea,password元素中的onChange事件当成onInput事件
    change: function change(dom) {
        if (/text|password/.test(dom.type)) {
            addEvent(document, createHandle, "input");
        }
    }
};

var mappingStrategy = {
    style: function style(domNode, _style) {
        if (_style !== undefined) {
            Object.keys(_style).forEach(function (styleName) {
                domNode.style[styleName] = (0, _utils.styleHelper)(styleName, _style[styleName]);
            });
        }
    },
    clearEvents: function clearEvents(domNode, eventCb, eventName) {
        var events = domNode.__events || {};
        events[eventName] = _utils.noop;
        domNode.__events = events; //用于triggerEventByPath中获取event
    },
    event: function event(domNode, eventCb, eventName) {
        var events = domNode.__events || {};
        events[eventName] = eventCb;
        domNode.__events = events; //用于triggerEventByPath中获取event

        if (!registerdEvent[eventName]) {
            //所有事件只注册一次
            registerdEvent[eventName] = 1;

            if (specialHook[eventName]) {
                specialHook[eventName](domNode);
            } else {
                addEvent(document, dispatchEvent, eventName);
            }
        }
    },
    className: function className(domNode, _className) {
        if (_className !== undefined) {
            domNode.className = _className;
        }
    },
    dangerouslySetInnerHTML: function dangerouslySetInnerHTML(domNode, html) {
        var oldhtml = domNode.innerHTML;
        if (html.__html !== oldhtml) {
            domNode.innerHTML = html.__html;
        }
    },
    otherProps: function otherProps(domNode, prop, propName) {
        if (prop !== void 666 || propName !== void 666) {
            domNode[propName] = prop;
        }
    }
};

function addEvent(domNode, fn, eventName) {

    if (domNode.addEventListener) {
        domNode.addEventListener(eventName, fn, false);
    } else if (domNode.attachEvent) {
        domNode.attachEvent("on" + eventName, fn);
    }
}

function dispatchEvent(event, eventName, end) {
    var path = getEventPath(event, end);
    var E = new _event.SyntheticEvent(event);
    _utils.options.async = true;
    if (eventName) {
        E.type = eventName;
    }

    triggerEventByPath(E, path); //触发event默认以冒泡形式
    _utils.options.async = false;
    for (var dirty in _utils.options.dirtyComponent) {
        _utils.options.dirtyComponent[dirty].updateComponent();
    }
    _utils.options.dirtyComponent = {}; //清空
}

/**
 * 触发event默认以冒泡形式
 * 冒泡：从里到外
 * 捕获：从外到里
 * @param {array} path
 */
function triggerEventByPath(e, path) {
    var thisEvenType = e.type;
    for (var i = 0; i < path.length; i++) {
        var events = path[i].__events;
        for (var eventName in events) {
            var fn = events[eventName];
            e.currentTarget = path[i];
            if (typeof fn === 'function' && thisEvenType === eventName) {

                fn.call(path[i], e); //触发回调函数默认以冒泡形式
            }
        }
    }
}

/**
 * 当触发event的时候，我们利用这个函数
 * 去寻找触发路径上有函数回调的路径
 * @param {event} event
 */
function getEventPath(event, end) {
    var path = [];
    var pathEnd = end || document;
    var begin = event.target;

    while (1) {
        if (begin.__events) {
            path.push(begin);
        }
        begin = begin.parentNode; //迭代
        if (begin && begin._PortalHostNode) {
            begin = begin._PortalHostNode;
        }
        if (!begin) {
            break;
        }
    }
    return path;
}

exports.mapProp = mapProp;
exports.clearEvents = clearEvents;
exports.updateProps = updateProps;
exports.mappingStrategy = mappingStrategy;
exports.getEventPath = getEventPath;

/***/ }),

/***/ "./src/refs.js":
/*!*********************!*\
  !*** ./src/refs.js ***!
  \*********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.clearRefs = exports.setRef = undefined;

var _utils = __webpack_require__(/*! ./utils */ "./src/utils.js");

function setRef(Vnode, instance, domNode) {
    if (instance) {
        var refType = (0, _utils.typeNumber)(Vnode.ref);
        if (refStrategy[refType]) {
            refStrategy[refType](Vnode, Vnode.owner, domNode);
        }
    }
}

function clearRefs(refs) {
    if (typeof refs === 'function') {
        refs(null);
    } else {
        for (var refName in refs) {
            refs[refName] = null;
        }
    }
}

var refStrategy = {
    3: function _(Vnode, instance, domNode) {
        if (Vnode._instance) {
            instance.refs[Vnode.ref] = Vnode._instance;
        } else {
            instance.refs[Vnode.ref] = domNode;
        }
    },
    4: function _(Vnode, instance, domNode) {
        refStrategy[3](Vnode, instance, domNode);
    },
    5: function _(Vnode, instance, domNode) {
        if (Vnode._instance) {
            Vnode.ref(Vnode._instance);
        } else {
            Vnode.ref(domNode);
        }
    }
};

exports.setRef = setRef;
exports.clearRefs = clearRefs;

/***/ }),

/***/ "./src/utils.js":
/*!**********************!*\
  !*** ./src/utils.js ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
var __type = Object.prototype.toString;

var options = {
    async: false,
    dirtyComponent: {}
};

var numberMap = {
    //null undefined IE6-8这里会返回[object Object]
    "[object Boolean]": 2,
    "[object Number]": 3,
    "[object String]": 4,
    "[object Function]": 5,
    "[object Symbol]": 6,
    "[object Array]": 7
};

/**
 * 给数字类的加上'px'
 * @param {*} styleNumber
 */
var specialStyle = {
    zIndex: 1
};

function styleHelper(styleName, styleNumber) {
    if (typeNumber(styleNumber) === 3) {
        var style = specialStyle[styleName] ? styleNumber : styleNumber + 'px';
        return style;
    }
    return styleNumber;
}

/**
 * undefined: 0, null: 1, boolean:2, number: 3, string: 4, function: 5, symbol:6, array: 7, object:8
 * @param {any} data
 */
function typeNumber(data) {
    if (data === null) {
        return 1;
    }
    if (data === undefined) {
        return 0;
    }
    var a = numberMap[__type.call(data)];
    return a || 8;
}

/**
 * 对比新旧Vnode是否一样
 * @param {Vnode} pre
 * @param {Vnode} next
 */
function isSameVnode(pre, next) {
    if (pre.type === next.type && pre.key === next.key) {
        return true;
    }
    return false;
}

/**
 * 将节点的key放入map中
 *
 * @param {Vnode} old
 */
function mapKeyToIndex(old) {
    var hascode = {};
    old.forEach(function (el, index) {
        if (el.key) {
            hascode[el.key] = index;
        }
    });
    return hascode;
}

/**
 * 判定否为与事件相关
 *
 * @param {any} name
 * @returns
 */
function isEventName(name) {
    return (/^on[A-Z]/.test(name)
    );
}

function isEventNameLowerCase(name) {
    return (/^on[a-z]/.test(name)
    );
}

/**
 * 展开对象
 * @param {*} obj
 * @param {*} props
 */

function extend(obj, props) {
    for (var i in props) {
        obj[i] = props[i];
    }return obj;
}

/**
 * 空函数
 */
var noop = function noop() {};

exports.options = options;
exports.styleHelper = styleHelper;
exports.typeNumber = typeNumber;
exports.isSameVnode = isSameVnode;
exports.mapKeyToIndex = mapKeyToIndex;
exports.isEventName = isEventName;
exports.isEventNameLowerCase = isEventNameLowerCase;
exports.extend = extend;
exports.noop = noop;

/***/ }),

/***/ "./src/vdom.js":
/*!*********************!*\
  !*** ./src/vdom.js ***!
  \*********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.render = exports.findDOMNode = exports.update = exports.currentOwner = exports.createPortal = undefined;

var _utils = __webpack_require__(/*! ./utils */ "./src/utils.js");

var _createElement = __webpack_require__(/*! ./createElement */ "./src/createElement.js");

var _mapProps = __webpack_require__(/*! ./mapProps */ "./src/mapProps.js");

var _refs = __webpack_require__(/*! ./refs */ "./src/refs.js");

var _dispose = __webpack_require__(/*! ./dispose */ "./src/dispose.js");

var _component = __webpack_require__(/*! ./component */ "./src/component.js");

var _errorBoundary = __webpack_require__(/*! ./errorBoundary */ "./src/errorBoundary.js");

//Top Api
function createPortal(children, container) {
    var domNode = void 0;
    if (container) {
        if (Array.isArray(children)) {
            domNode = mountChild(children, container);
        } else {
            domNode = render(children, container);
        }
    } else {
        throw new Error('请给portal一个插入的目标');
    }
    //用于记录Portal的事物
    // let lastOwner = currentOwner.cur;
    // currentOwner.cur = instance;


    var CreatePortalVnode = new _createElement.Vnode('#text', "createPortal", null, null);
    CreatePortalVnode._PortalHostNode = container;
    return CreatePortalVnode;
}

var mountIndex = 0; //全局变量
var containerMap = {};

var currentOwner = {
    cur: null
};

function instanceProps(componentVnode) {
    return {
        oldState: componentVnode._instance.state,
        oldProps: componentVnode._instance.props,
        oldContext: componentVnode._instance.context,
        oldVnode: componentVnode._instance.Vnode
    };
}

function mountIndexAdd() {
    return mountIndex++;
}

function updateText(oldTextVnode, newTextVnode, parentDomNode) {
    var dom = oldTextVnode._hostNode;
    if (oldTextVnode.props !== newTextVnode.props) {
        dom.nodeValue = newTextVnode.props;
    }
}

function updateChild(oldChild, newChild, parentDomNode, parentContext) {
    newChild = (0, _createElement.flattenChildren)(newChild);
    oldChild = oldChild || [];
    if (!Array.isArray(oldChild)) oldChild = [oldChild];
    if (!Array.isArray(newChild)) newChild = [newChild];

    var oldLength = oldChild.length,
        newLength = newChild.length,
        oldStartIndex = 0,
        newStartIndex = 0,
        oldEndIndex = oldLength - 1,
        newEndIndex = newLength - 1,
        oldStartVnode = oldChild[0],
        newStartVnode = newChild[0],
        oldEndVnode = oldChild[oldEndIndex],
        newEndVnode = newChild[newEndIndex],
        hascode = {};

    if (newLength >= 0 && !oldLength) {
        newChild.forEach(function (newVnode, index) {
            renderByLuy(newVnode, parentDomNode, false, parentContext);
            newChild[index] = newVnode;
        });
        return newChild;
    }
    if (!newLength && oldLength >= 0) {
        oldChild.forEach(function (oldVnode) {
            (0, _dispose.disposeVnode)(oldVnode);
        });
        return newChild[0];
    }

    while (oldStartIndex <= oldEndIndex && newStartIndex <= newEndIndex) {
        if (oldStartVnode === undefined || oldStartVnode === null) {
            oldStartVnode = oldChild[++oldStartIndex];
        } else if (oldEndVnode === undefined || oldEndVnode === null) {
            oldEndVnode = oldChild[--oldEndIndex];
        } else if (newStartVnode === undefined || newStartVnode === null) {
            newStartVnode = newChild[++newStartIndex];
        } else if (newEndVnode === undefined || newEndVnode === null) {
            newEndVnode = newChild[--newEndIndex];
        } else if ((0, _utils.isSameVnode)(oldStartVnode, newStartVnode)) {
            update(oldStartVnode, newStartVnode, newStartVnode._hostNode, parentContext);
            oldStartVnode = oldChild[++oldStartIndex];
            newStartVnode = newChild[++newStartIndex];
        } else if ((0, _utils.isSameVnode)(oldEndVnode, newEndVnode)) {
            update(oldEndVnode, newEndVnode, newEndVnode._hostNode, parentContext);
            oldEndVnode = oldChild[--oldEndIndex];
            newEndVnode = newChild[--newEndIndex];
        } else if ((0, _utils.isSameVnode)(oldStartVnode, newEndVnode)) {
            var dom = oldStartVnode._hostNode;
            parentDomNode.insertBefore(dom, oldEndVnode.nextSibling);
            update(oldStartVnode, newEndVnode, oldStartVnode._hostNode._hostNode, parentContext);
            oldStartVnode = oldChild[++oldStartIndex];
            newEndVnode = newChild[--newEndIndex];
        } else if ((0, _utils.isSameVnode)(oldEndVnode, newStartVnode)) {
            var _dom = oldEndVnode._hostNode;
            parentDomNode.insertBefore(_dom, oldStartVnode._hostNode);
            update(oldStartVnode, newEndVnode, oldStartVnode._hostNode, parentContext);
            oldEndVnode = oldChild[--oldEndIndex];
            newStartVnode = newChild[++newStartIndex];
        } else {
            if (hascode === undefined) hascode = (0, _utils.mapKeyToIndex)(oldChild);

            var indexInOld = hascode[newStartVnode.key];

            if (indexInOld === undefined) {
                if (newStartVnode.type === '#text') {
                    update(oldStartVnode, newStartVnode, parentDomNode, parentContext);
                } else {
                    var _parentDomNode = parentDomNode;
                    if (parentDomNode.nodeName === '#text') {
                        _parentDomNode = parentDomNode.parentNode;
                    }
                    if (oldStartVnode.type === '#text') {
                        _parentDomNode = parentDomNode.parentNode;
                    }
                    var newElm = renderByLuy(newStartVnode, _parentDomNode, true, parentContext);
                    _parentDomNode.insertBefore(newElm, oldStartVnode._hostNode);
                }

                newStartVnode = newChild[++newStartIndex];
            } else {
                var moveVnode = oldChild[indexInOld];
                update(moveVnode, newStartVnode, moveVnode._hostNode, parentContext);
                parentDomNode.insertBefore(moveVnode._hostNode, oldStartVnode._hostNode);
                oldChild[indexInOld] = undefined;
                newStartVnode = newChild[++newStartIndex];
            }
        }
        if (oldStartIndex > oldEndIndex) {

            for (; newStartIndex - 1 < newEndIndex; newStartIndex++) {
                if (newChild[newStartIndex]) {
                    var newDomNode = renderByLuy(newChild[newStartIndex], parentDomNode, true, parentContext);
                    parentDomNode.appendChild(newDomNode);
                    // if (oldChild[oldChild.length - 1]) {

                    // } else {
                    //     parentDomNode.insertBefore(newDomNode, oldChild[oldChild.length - 1]._hostNode)
                    // }
                    newChild[newStartIndex]._hostNode = newDomNode;
                }
            }
        } else if (newStartIndex > newEndIndex) {
            for (; oldStartIndex - 1 < oldEndIndex; oldStartIndex++) {
                if (oldChild[oldStartIndex]) {
                    var removeNode = oldChild[oldStartIndex];
                    if ((0, _utils.typeNumber)(removeNode._hostNode) <= 1) {
                        //证明这个节点已经被移除；
                        continue;
                    }
                    (0, _dispose.disposeVnode)(removeNode);
                }
            }
        }
    }
    return newChild;
}

/**
 * 当我们更新组件的时候，并不需要重新创建一个组件，而是拿到久的组件的props,state,context就可以进行重新render
 * 而且要注意的是，组件的更新并不需要比对或者交换state,因为组件的更新完全依靠外部的context和props
 * @param {*} oldComponentVnode 老的孩子组件，_instance里面有着这个组件的实例
 * @param {*} newComponentVnode 新的组件
 * @param {*} parentContext 父亲context
 * @param {*} parentDomNode 父亲节点
 */
function updateComponent(oldComponentVnode, newComponentVnode, parentContext, parentDomNode) {
    var _instanceProps = instanceProps(oldComponentVnode),
        oldState = _instanceProps.oldState,
        oldProps = _instanceProps.oldProps,
        oldContext = _instanceProps.oldContext,
        oldVnode = _instanceProps.oldVnode;

    var newProps = newComponentVnode.props;
    var newContext = parentContext;
    var instance = oldComponentVnode._instance;
    // const willReceive = oldContext !== newContext || oldProps !== newProps
    //如果props和context中的任意一个改变了，那么就会触发组件的receive,render,update等
    //但是依旧会继续往下比较

    //更新原来组件的信息
    oldComponentVnode._instance.props = newProps;

    if (instance.getChildContext) {
        oldComponentVnode._instance.context = (0, _utils.extend)((0, _utils.extend)({}, newContext), instance.getChildContext());
    } else {
        oldComponentVnode._instance.context = (0, _utils.extend)({}, newContext);
    }

    oldComponentVnode._instance.lifeCycle = _component.Com.UPDATING;
    if (oldComponentVnode._instance.componentWillReceiveProps) {
        (0, _errorBoundary.catchError)(oldComponentVnode._instance, 'componentWillReceiveProps', [newProps, newContext]);
        var mergedState = oldComponentVnode._instance.state;
        oldComponentVnode._instance._penddingState.forEach(function (partialState) {
            mergedState = (0, _utils.extend)((0, _utils.extend)({}, mergedState), partialState.partialNewState);
        });
        oldComponentVnode._instance.state = mergedState;
    }

    if (oldComponentVnode._instance.shouldComponentUpdate) {
        var shouldUpdate = (0, _errorBoundary.catchError)(oldComponentVnode._instance, 'shouldComponentUpdate', [newProps, oldState, newContext]);
        if (!shouldUpdate) {
            //无论shouldComponentUpdate结果是如何，数据都会给用户设置上去
            //但是不一定会刷新
            oldComponentVnode._instance.props = newProps;
            oldComponentVnode._instance.context = newContext;
            return;
        }
    }

    if (oldComponentVnode._instance.componentWillUpdate) {
        (0, _errorBoundary.catchError)(oldComponentVnode._instance, 'componentWillUpdate', [newProps, oldState, newContext]);
    }

    var lastOwner = currentOwner.cur;
    currentOwner.cur = oldComponentVnode._instance;

    var newVnode = oldComponentVnode._instance.render ? (0, _errorBoundary.catchError)(oldComponentVnode._instance, 'render', []) : new newComponentVnode.type(newProps, newContext);
    newVnode = newVnode ? newVnode : new _createElement.Vnode('#text', "", null, null); //用户有可能返回null，当返回null的时候使用一个空白dom代替
    var renderedType = (0, _utils.typeNumber)(newVnode);
    if (renderedType === 3 && renderedType === 4) {
        renderedVnode = new _createElement.Vnode('#text', renderedVnode, null, null);
    }
    var fixedOldVnode = oldVnode ? oldVnode : oldComponentVnode._instance;

    currentOwner.cur = lastOwner;

    var willUpdate = _utils.options.dirtyComponent[oldComponentVnode._instance._uniqueId]; //因为用react-redux更新的时候，不然会重复更新.
    if (willUpdate) {
        //如果这个component正好是需要更新的component，那么则更新，然后就将他从map中删除
        //不然会重复更新
        delete _utils.options.dirtyComponent[oldComponentVnode._instance._uniqueId];
    }

    //更新真实dom,保存新的节点

    update(fixedOldVnode, newVnode, oldComponentVnode._hostNode, instance.context);
    oldComponentVnode._hostNode = newVnode._hostNode;
    if (oldComponentVnode._instance.Vnode) {
        //更新React component的时候需要用新的完全更新旧的component，不然无法更新
        oldComponentVnode._instance.Vnode = newVnode;
    } else {
        oldComponentVnode._instance = newVnode;
    }

    if (oldComponentVnode._instance) {
        if (oldComponentVnode._instance.componentDidUpdate) {
            (0, _errorBoundary.catchError)(oldComponentVnode._instance, 'componentDidUpdate', [oldProps, oldState, oldContext]);
        }
        oldComponentVnode._instance.lifeCycle = _component.Com.UPDATED;
    }
}

function update(oldVnode, newVnode, parentDomNode, parentContext) {
    newVnode._hostNode = oldVnode._hostNode;
    if (oldVnode.type === newVnode.type) {
        if ((0, _utils.typeNumber)(oldVnode) === 7) {
            newVnode = updateChild(oldVnode, newVnode, parentDomNode, parentContext);

            newVnode.return = oldVnode.return;
            newVnode._hostNode = newVnode[0]._hostNode;
        }

        if (oldVnode.type === "#text") {
            newVnode._hostNode = oldVnode._hostNode; //更新一个dom节点
            updateText(oldVnode, newVnode);

            return newVnode;
        }
        if (typeof oldVnode.type === 'string') {
            //原生html
            (0, _mapProps.updateProps)(oldVnode.props, newVnode.props, newVnode._hostNode);
            if (oldVnode.ref !== newVnode.ref) {
                // if (typeNumber(oldVnode.ref) === 5) {
                //     oldVnode.ref(null)
                // }
                (0, _refs.setRef)(newVnode, oldVnode.owner, newVnode._hostNode);
            }

            //更新后的child，返回给组件
            newVnode.props.children = updateChild(oldVnode.props.children, newVnode.props.children, oldVnode._hostNode, parentContext);
        }
        if (typeof oldVnode.type === 'function') {
            //非原生
            if (!oldVnode._instance.render) {
                var _newVnode = newVnode,
                    props = _newVnode.props;

                var newStateLessInstance = new newVnode.type(props, parentContext);
                update(oldVnode._instance, newStateLessInstance, parentDomNode, parentContext);
                newStateLessInstance.owner = oldVnode._instance.owner;
                newStateLessInstance.ref = oldVnode._instance.ref;
                newStateLessInstance.key = oldVnode._instance.key;
                newVnode._instance = newStateLessInstance;
                return newVnode;
            }

            updateComponent(oldVnode, newVnode, parentContext, parentDomNode);
            newVnode.owner = oldVnode.owner;
            newVnode.ref = oldVnode.ref;
            newVnode.key = oldVnode.key;
            newVnode._instance = oldVnode._instance;
            newVnode._PortalHostNode = oldVnode._PortalHostNode ? oldVnode._PortalHostNode : void 666;
        }
    } else {
        if ((0, _utils.typeNumber)(newVnode) === 7) {
            newVnode.forEach(function (newvnode, index) {

                var dom = renderByLuy(newvnode, parentDomNode, true, parentContext);
                if (index === 0) newVnode._hostNode = dom;
                var parentNode = parentDomNode.parentNode;
                if (newvnode._hostNode) {
                    parentNode.insertBefore(dom, oldVnode._hostNode);
                } else {
                    parentNode.appendChild(dom);
                    newvnode._hostNode = dom;
                }
            });
            (0, _dispose.disposeVnode)(oldVnode);
            return newVnode;
        }
        var dom = renderByLuy(newVnode, parentDomNode, true, parentContext);
        if ((0, _utils.typeNumber)(newVnode.type) !== 5) {
            // disposeVnode(oldVnode);
            newVnode._hostNode = dom;

            // const parentNode = parentDomNode.parentNode
            if (oldVnode._hostNode) {
                parentDomNode.insertBefore(dom, oldVnode._hostNode);
                (0, _dispose.disposeVnode)(oldVnode);
            } else {
                parentDomNode.appendChild(dom);
            }
        }
    }
    return newVnode;
}

/**
 * 递归渲染虚拟组件
 * @param {*} Vnode
 * @param {Element} parentDomNode
 */
function mountComponent(Vnode, parentDomNode, parentContext) {
    var type = Vnode.type,
        props = Vnode.props,
        key = Vnode.key,
        ref = Vnode.ref;


    var Component = type;
    var instance = new Component(props, parentContext);
    Vnode._instance = instance; // 在父节点上的child元素会保存一个自己

    if (!instance.render) {
        Vnode._instance = instance; //for react-redux,这里是渲染无状态组件
        return renderByLuy(instance, parentDomNode, false, parentContext);
    }

    if (instance.getChildContext) {
        //如果用户定义getChildContext，那么用它生成子context
        instance.context = (0, _utils.extend)((0, _utils.extend)({}, instance.context), instance.getChildContext());
    } else {
        instance.context = (0, _utils.extend)({}, parentContext);
    }

    //生命周期函数
    if (instance.componentWillMount) {
        var isCatched = (0, _errorBoundary.catchError)(instance, 'componentWillMount', [Vnode]);
        if (isCatched) return;
    }

    var lastOwner = currentOwner.cur;
    currentOwner.cur = instance;
    var renderedVnode = (0, _errorBoundary.catchError)(instance, 'render', [Vnode]);
    var renderedType = (0, _utils.typeNumber)(renderedVnode);
    if (renderedType === 7) {
        renderedVnode = mountChild(renderedVnode, parentDomNode, parentContext, instance, Vnode);
    }
    if (renderedType === 3 && renderedType === 4) {
        renderedVnode = new _createElement.Vnode('#text', renderedVnode, null, null);
    }
    currentOwner.cur = lastOwner;

    if (renderedVnode === void 233) {
        // console.warn('你可能忘记在组件render()方法中返回jsx了');
        return;
    }
    renderedVnode = renderedVnode ? renderedVnode : new _createElement.Vnode('#text', "", null, null);

    renderedVnode.key = key || null;
    instance.Vnode = renderedVnode;
    instance.Vnode._mountIndex = mountIndexAdd();

    Vnode.displayName = Component.name; //以下这两行用于componentDidcatch
    instance.Vnode.return = Vnode; //必须要在插入前设置return(父Vnode)给所有的Vnode.

    var domNode = null;
    if (renderedType !== 7) {
        domNode = renderByLuy(renderedVnode, parentDomNode, false, instance.context, instance);
        // renderedVnode.displayName = Component.name;//记录名字
    } else {
        domNode = renderedVnode[0]._hostNode;
    }

    (0, _refs.setRef)(Vnode, instance, domNode);

    Vnode._hostNode = domNode;
    instance.Vnode._hostNode = domNode; //用于在更新时期oldVnode的时候获取_hostNode

    if (renderedVnode._PortalHostNode) {
        //支持react createPortal
        Vnode._PortalHostNode = renderedVnode._PortalHostNode;
        renderedVnode._PortalHostNode._PortalHostNode = domNode;
    }

    if (instance.componentDidMount) {
        //Moutting变量用于标记组件是否正在挂载
        //如果正在挂载，则所有的setState全部都要合并
        instance.lifeCycle = _component.Com.MOUNTTING;
        (0, _errorBoundary.catchError)(instance, 'componentDidMount', []);
        instance.componentDidMount = null; //防止用户调用
        instance.lifeCycle = _component.Com.MOUNT;
    }

    if (instance.componentDidCatch) {
        // runException();
        // instance.componentDidCatch();
    }

    instance._updateInLifeCycle(); // componentDidMount之后一次性更新
    return domNode;
}

function mountNativeElement(Vnode, parentDomNode, instance) {
    var domNode = renderByLuy(Vnode, parentDomNode, false, {}, instance);
    Vnode._hostNode = domNode;
    Vnode._mountIndex = mountIndexAdd();
    return domNode;
}

function mountTextComponent(Vnode, domNode) {
    var fixText = Vnode.props === 'createPortal' ? '' : Vnode.props;
    var textDomNode = document.createTextNode(fixText);
    domNode.appendChild(textDomNode);
    Vnode._hostNode = textDomNode;
    Vnode._mountIndex = mountIndexAdd();
    return textDomNode;
}

function mountChild(childrenVnode, parentDomNode, parentContext, instance, parentVnode) {

    var childType = (0, _utils.typeNumber)(childrenVnode);
    var flattenChildList = childrenVnode;

    if (childrenVnode === undefined) {
        flattenChildList = (0, _createElement.flattenChildren)(childrenVnode, parentVnode);
    }

    if (childType === 8 && childrenVnode !== undefined) {
        //Vnode
        flattenChildList = (0, _createElement.flattenChildren)(childrenVnode, parentVnode);
        if ((0, _utils.typeNumber)(childrenVnode.type) === 5) {
            flattenChildList._hostNode = renderByLuy(flattenChildList, parentDomNode, false, parentContext, instance);
        } else if ((0, _utils.typeNumber)(childrenVnode.type) === 3 || (0, _utils.typeNumber)(childrenVnode.type) === 4) {
            flattenChildList._hostNode = mountNativeElement(flattenChildList, parentDomNode, instance);
        }
    }
    if (childType === 7) {
        //list
        flattenChildList = (0, _createElement.flattenChildren)(childrenVnode, parentVnode);
        flattenChildList.forEach(function (item) {
            if (item) {
                if (typeof item.type === 'function') {
                    //如果是组件先不渲染子嗣
                    mountComponent(item, parentDomNode, parentContext);
                } else {
                    renderByLuy(item, parentDomNode, false, parentContext, instance);
                }
            }
        });
    }
    if (childType === 4 || childType === 3) {
        //string or number
        flattenChildList = (0, _createElement.flattenChildren)(childrenVnode, parentVnode);
        mountTextComponent(flattenChildList, parentDomNode);
    }
    return flattenChildList;
}

function findDOMNode(ref) {
    if (ref == null) {
        return null;
    }
    if (ref.nodeType === 1) {
        return ref;
    }
    return ref.__dom || null;
}

/**
 * ReactDOM.render()函数入口
 * 渲染组件，组件的子组件，都在这里
 * @param {*} Vnode
 * @param {Element} container
 * @param {boolean} isUpdate
 * @param {boolean} instance 用于实现refs机制
 */
var depth = 0;

function renderByLuy(Vnode, container, isUpdate, parentContext, instance) {
    var type = Vnode.type,
        props = Vnode.props;


    if (!type) return;
    var children = props.children;

    var domNode = void 0;
    if (typeof type === 'function') {
        var fixContext = parentContext || {};
        domNode = mountComponent(Vnode, container, fixContext);
    } else if (typeof type === 'string' && type === '#text') {
        domNode = mountTextComponent(Vnode, container);
    } else {
        domNode = document.createElement(type);
    }

    if (typeof type !== 'function') {
        //当Vnode是一个虚拟组件的时候，则不要渲染他的子组件，而是等到创建他了以后，再根据他的render函数来渲染
        if ((0, _utils.typeNumber)(children) > 2 && children !== undefined) {
            var NewChild = mountChild(children, domNode, parentContext, instance, Vnode); //flatten之后的child 要保存下来
            props.children = NewChild;
        }
    }
    Vnode._hostNode = domNode; //缓存真实节点

    if ((0, _utils.typeNumber)(domNode) === 7) {
        if (isUpdate) {
            return domNode;
        } else {
            if (container && domNode && container.nodeName !== '#text') {
                domNode.forEach(function (DOM_SINGLE_Node) {
                    container.appendChild(DOM_SINGLE_Node);
                });
            }
        }
    }

    (0, _refs.setRef)(Vnode, instance, domNode); //为虚拟组件添加ref
    (0, _mapProps.mapProp)(domNode, props, Vnode); //为元素添加props

    if (isUpdate) {
        return domNode;
    } else {
        Vnode._mountIndex = mountIndexAdd();
        if (container && domNode && container.nodeName !== '#text') {
            container.appendChild(domNode);
        }
    }
    return domNode;
}

/**
 *
 * @param {Vnode} Vnode Vnode是一颗虚拟DOM树，他的生成方式是babel-transform-react-jsx调用createElement进行的。
 * @param {Element} container 这是一个真实DOM节点，用于插入虚拟DOM。
 */
function render(Vnode, container) {
    if ((0, _utils.typeNumber)(container) !== 8) {
        throw new Error('Target container is not a DOM element.');
    }

    var UniqueKey = container.UniqueKey;
    if (container.UniqueKey) {
        //已经被渲染
        var oldVnode = containerMap[UniqueKey];
        var rootVnode = update(oldVnode, Vnode, container);
        (0, _errorBoundary.runException)();
        return Vnode._instance;
    } else {
        //第一次渲染的时候
        Vnode.isTop = true;
        container.UniqueKey = mountIndexAdd();
        containerMap[container.UniqueKey] = Vnode;
        renderByLuy(Vnode, container, false, Vnode.context, Vnode.owner);
        (0, _errorBoundary.runException)();
        return Vnode._instance;
    }
}

exports.createPortal = createPortal;
exports.currentOwner = currentOwner;
exports.update = update;
exports.findDOMNode = findDOMNode;
exports.render = render;

/***/ }),

/***/ 0:
/*!*****************************!*\
  !*** multi ./demo/index.js ***!
  \*****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! ./demo/index.js */"./demo/index.js");


/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vZGVtby9BcHAuanMiLCJ3ZWJwYWNrOi8vLy4vZGVtby9jb21wb25lbnQvUGxvdEJvYXJkLmpzIiwid2VicGFjazovLy8uL2RlbW8vY29udGFpbmVyL0hlYWRlci5qcyIsIndlYnBhY2s6Ly8vLi9kZW1vL2NvbnRhaW5lci9Ib21lLmpzIiwid2VicGFjazovLy8uL2RlbW8vaW5kZXguanMiLCJ3ZWJwYWNrOi8vLy4vZGVtby9yZWFjdGluZy5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvY2hpbGRyZW4uanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2Nsb25lRWxlbWVudC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvY29tcG9uZW50LmpzIiwid2VicGFjazovLy8uL3NyYy9jb250cm9sbGVkQ29tcG9uZW50LmpzIiwid2VicGFjazovLy8uL3NyYy9jcmVhdGVFbGVtZW50LmpzIiwid2VicGFjazovLy8uL3NyYy9kaXNwb3NlLmpzIiwid2VicGFjazovLy8uL3NyYy9lcnJvckJvdW5kYXJ5LmpzIiwid2VicGFjazovLy8uL3NyYy9ldmVudC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvaW5kZXguanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL21hcFByb3BzLmpzIiwid2VicGFjazovLy8uL3NyYy9yZWZzLmpzIiwid2VicGFjazovLy8uL3NyYy91dGlscy5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvdmRvbS5qcyJdLCJuYW1lcyI6WyJBcHAiLCJDb21wb25lbnQiLCJQbG90Qm9hcmQiLCJib2FyZERhdGEiLCJwcm9wcyIsInN0eWxlQm9hcmQiLCJ3aWR0aCIsImhlaWdodCIsImJhY2tncm91bmRDb2xvciIsImZsb2F0IiwidGV4dEFsaWduIiwibWFyZ2luIiwibWFwIiwiaXRlbSIsImkiLCJIZWFkZXIiLCJzdGF0ZSIsImhlYWRlck1lbnUiLCJzdHlsZUJ0biIsInBhZGRpbmciLCJjb2xvciIsImJvcmRlciIsImJvcmRlclJhZGl1cyIsImN1cnNvciIsImZvbnRTaXplIiwiSG9tZSIsInJlbmRlciIsImRvY3VtZW50IiwiZ2V0RWxlbWVudEJ5SWQiLCJDaGlsZHJlbiIsImNoaWxkVm5vZGUiLCJjYWxsYmFjayIsImNvbnRleHQiLCJ1bmRlZmluZWQiLCJjYWxsIiwicmV0IiwiZm9yRWFjaCIsIm9sZFZub2RlIiwiaW5kZXgiLCJuZXdWbm9kZSIsInB1c2giLCJvbmx5IiwiRXJyb3IiLCJjb3VudCIsImxlbmd0aCIsImZsYXR0ZW4iLCJ0b0FycmF5IiwiZWwiLCJjbG9uZUVsZW1lbnQiLCJ2bm9kZSIsImNvbmZpZyIsImNoaWxkcmVuIiwicHJvcE5hbWUiLCJuZXdLZXkiLCJrZXkiLCJuZXdSZWYiLCJyZWYiLCJ0eXBlIiwiQ29tIiwiQ1JFQVRFIiwiTU9VTlQiLCJVUERBVElORyIsIlVQREFURUQiLCJNT1VOVFRJTkciLCJDQVRDSElORyIsInVuaXF1ZUlkIiwiUmVhY3RDbGFzcyIsIm5leHRTdGF0ZSIsIl9yZW5kZXJDYWxsYmFja3MiLCJsaWZlQ3ljbGUiLCJzdGF0ZU1lcmdlUXVldWUiLCJfcGVuZGRpbmdTdGF0ZSIsInJlZnMiLCJfdW5pcXVlSWQiLCJwcmV2U3RhdGUiLCJWbm9kZSIsIm9sZENvbnRleHQiLCJwYXJ0aWFsTmV3U3RhdGUiLCJPYmplY3QiLCJhc3NpZ24iLCJnZXRDaGlsZENvbnRleHQiLCJjb21wb25lbnRXaWxsVXBkYXRlIiwibGFzdE93bmVyIiwiY3VyIiwiX2hvc3ROb2RlIiwiY29tcG9uZW50RGlkVXBkYXRlIiwidGVtcFN0YXRlIiwidXBkYXRlQ29tcG9uZW50Iiwic2hvdWxkQ29tcG9uZW50VXBkYXRlIiwic2hvdWxkVXBkYXRlIiwiYXN5bmMiLCJkaXJ0eSIsImRpcnR5Q29tcG9uZW50IiwiY29udHJvbGxQcm9wcyIsImRhdGUiLCJkYXRldGltZSIsImVtYWlsIiwibW9udGgiLCJudW1iZXIiLCJwYXNzd29yZCIsInJhbmdlIiwic2VhcmNoIiwidGVsIiwidGV4dCIsInRpbWUiLCJ1cmwiLCJ3ZWVrIiwidGV4dGFyZWEiLCJjaGVja2JveCIsInJhZGlvIiwiY29udHJvbGxEYXRhIiwib25DaGFuZ2UiLCJvbklucHV0IiwicmVhZE9ubHkiLCJkaXNhYmxlZCIsInByZXZlbnRVc2VySW5wdXQiLCJvbkNsaWNrIiwicHJldmVudFVzZXJDbGljayIsInByZXZlbnRVc2VyQ2hhbmdlIiwibWFwQ29udHJvbGxlZEVsZW1lbnQiLCJkb21Ob2RlIiwiY29udHJvbGxUeXBlIiwiZGF0YSIsImNvbnRyb2xsUHJvcCIsIm90aGVyUHJvcHMiLCJldmVudCIsImhhc090aGVyQ29udHJvbGxQcm9wZXJ0eSIsImNvbnNvbGUiLCJ3YXJuIiwibm9kZU5hbWUiLCJrZXlzIiwiX2xhc3RWYWx1ZSIsImUiLCJ0YXJnZXQiLCJuYW1lIiwidmFsdWUiLCJvcHRpb25zIiwibXVsdGlwbGUiLCJ1cGRhdGVPcHRpb25zT25lIiwicHJldmVudERlZmF1bHQiLCJsYXN0VmFsdWUiLCJzdHJpbmdWYWx1ZXMiLCJsb2ciLCJvcHRpb24iLCJzZWxlY3RlZCIsInVwZGF0ZU9wdGlvbnNNb3JlIiwic2VsZWN0ZWRWYWx1ZSIsIm4iLCJoYXNPd25Qcm9wZXJ0eSIsImZsYXR0ZW5DaGlsZHJlbiIsIlJFU0VSVkVEX1BST1BTIiwiX19zZWxmIiwiX19zb3VyY2UiLCJvd25lciIsImNyZWF0ZUVsZW1lbnQiLCJjaGlsZExlbmd0aCIsImRlZmF1bHRQcm9wcyIsInBhcmVudFZub2RlIiwiYXJ5IiwiaXNMYXN0U2ltcGxlIiwibGFzdFN0cmluZyIsImNoaWxkVHlwZSIsInJldHVybiIsImRpc3Bvc2VWbm9kZSIsImRpc3Bvc2VDaGlsZFZub2RlIiwiX2luc3RhbmNlIiwiY29tcG9uZW50V2lsbFVubW91bnQiLCJfUG9ydGFsSG9zdE5vZGUiLCJwYXJlbnQiLCJwYXJlbnROb2RlIiwicmVtb3ZlQ2hpbGQiLCJjaGlsZCIsIl9lcnJvclZub2RlIiwiVl9JbnN0YW5jZSIsImVycm9yTXNnIiwiZ2xvYmFsRXJyb3IiLCJjYXRjaEVycm9yIiwiSW5zdGFuY2UiLCJob29rbmFtZSIsImFyZ3MiLCJyZXN1bHRlIiwiYXBwbHkiLCJjb2xsZWN0RXJyb3JWbm9kZSIsImdldFJldHVybiIsImRpc3BsYXlOYW1lIiwiZ2V0TmFtZSIsInR5cGVfbnVtYmVyIiwidGFnTmFtZSIsInB1c2hFcnJvclZub2RlIiwiZXJyb3IiLCJfVm5vZGUiLCJlcnJvcl9hcnkiLCJpc1RvcCIsImNvbXBvbmVudERpZENhdGNoIiwiaW5zdGFuY2UiLCJydW5FeGNlcHRpb24iLCJpbnMiLCJzaGlmdCIsIl91cGRhdGVJbkxpZmVDeWNsZSIsIlN5bnRoZXRpY0V2ZW50IiwibmF0aXZlRXZlbnQiLCJldmVudFByb3RvIiwic3JjRWxlbWVudCIsImZpeEV2ZW50IiwidGltZVN0YW1wIiwiRGF0ZSIsInByb3RvdHlwZSIsInJldHVyblZhbHVlIiwiZml4SG9va3MiLCJzdG9wUHJvcGFnYXRpb24iLCJjYW5jZWxCdWJibGUiLCJfc3RvcFByb3BhZ2F0aW9uIiwicGVyc2lzdCIsIm5vb3AiLCJzdG9wSW1tZWRpYXRlUHJvcGFnYXRpb24iLCJzdG9wSW1tZWRpYXRlIiwidG9TdHJpbmciLCJSZWFjdCIsImZpbmRET01Ob2RlIiwiY3JlYXRlUG9ydGFsIiwiZm9ybUVsZW1lbnQiLCJJTlBVVCIsIlNFTEVDVCIsIlRFWFRBUkVBIiwiaXNGb3JtRWxlbWVudCIsIm1hcFByb3AiLCJldmVudE5hbWUiLCJzbGljZSIsInRvTG93ZXJDYXNlIiwibWFwcGluZ1N0cmF0ZWd5IiwiY2xlYXJFdmVudHMiLCJ1cGRhdGVQcm9wcyIsIm9sZFByb3BzIiwibmV3UHJvcHMiLCJob3N0Tm9kZSIsInJlc3RQcm9wcyIsIm5ld05hbWUiLCJyZWdpc3RlcmRFdmVudCIsImNvbnRyb2xsZWRFdmVudCIsImNoYW5nZSIsImlucHV0IiwiY3JlYXRlSGFuZGxlIiwiZGlzcGF0Y2hFdmVudCIsInNwZWNpYWxIb29rIiwiZG9tIiwidGVzdCIsImFkZEV2ZW50Iiwic3R5bGUiLCJzdHlsZU5hbWUiLCJldmVudENiIiwiZXZlbnRzIiwiX19ldmVudHMiLCJjbGFzc05hbWUiLCJkYW5nZXJvdXNseVNldElubmVySFRNTCIsImh0bWwiLCJvbGRodG1sIiwiaW5uZXJIVE1MIiwiX19odG1sIiwicHJvcCIsImZuIiwiYWRkRXZlbnRMaXN0ZW5lciIsImF0dGFjaEV2ZW50IiwiZW5kIiwicGF0aCIsImdldEV2ZW50UGF0aCIsIkUiLCJ0cmlnZ2VyRXZlbnRCeVBhdGgiLCJ0aGlzRXZlblR5cGUiLCJjdXJyZW50VGFyZ2V0IiwicGF0aEVuZCIsImJlZ2luIiwic2V0UmVmIiwicmVmVHlwZSIsInJlZlN0cmF0ZWd5IiwiY2xlYXJSZWZzIiwicmVmTmFtZSIsIl9fdHlwZSIsIm51bWJlck1hcCIsInNwZWNpYWxTdHlsZSIsInpJbmRleCIsInN0eWxlSGVscGVyIiwic3R5bGVOdW1iZXIiLCJ0eXBlTnVtYmVyIiwiYSIsImlzU2FtZVZub2RlIiwicHJlIiwibmV4dCIsIm1hcEtleVRvSW5kZXgiLCJvbGQiLCJoYXNjb2RlIiwiaXNFdmVudE5hbWUiLCJpc0V2ZW50TmFtZUxvd2VyQ2FzZSIsImV4dGVuZCIsIm9iaiIsImNvbnRhaW5lciIsIkFycmF5IiwiaXNBcnJheSIsIm1vdW50Q2hpbGQiLCJDcmVhdGVQb3J0YWxWbm9kZSIsIm1vdW50SW5kZXgiLCJjb250YWluZXJNYXAiLCJjdXJyZW50T3duZXIiLCJpbnN0YW5jZVByb3BzIiwiY29tcG9uZW50Vm5vZGUiLCJvbGRTdGF0ZSIsIm1vdW50SW5kZXhBZGQiLCJ1cGRhdGVUZXh0Iiwib2xkVGV4dFZub2RlIiwibmV3VGV4dFZub2RlIiwicGFyZW50RG9tTm9kZSIsIm5vZGVWYWx1ZSIsInVwZGF0ZUNoaWxkIiwib2xkQ2hpbGQiLCJuZXdDaGlsZCIsInBhcmVudENvbnRleHQiLCJvbGRMZW5ndGgiLCJuZXdMZW5ndGgiLCJvbGRTdGFydEluZGV4IiwibmV3U3RhcnRJbmRleCIsIm9sZEVuZEluZGV4IiwibmV3RW5kSW5kZXgiLCJvbGRTdGFydFZub2RlIiwibmV3U3RhcnRWbm9kZSIsIm9sZEVuZFZub2RlIiwibmV3RW5kVm5vZGUiLCJyZW5kZXJCeUx1eSIsInVwZGF0ZSIsImluc2VydEJlZm9yZSIsIm5leHRTaWJsaW5nIiwiaW5kZXhJbk9sZCIsIl9wYXJlbnREb21Ob2RlIiwibmV3RWxtIiwibW92ZVZub2RlIiwibmV3RG9tTm9kZSIsImFwcGVuZENoaWxkIiwicmVtb3ZlTm9kZSIsIm9sZENvbXBvbmVudFZub2RlIiwibmV3Q29tcG9uZW50Vm5vZGUiLCJuZXdDb250ZXh0IiwiY29tcG9uZW50V2lsbFJlY2VpdmVQcm9wcyIsIm1lcmdlZFN0YXRlIiwicGFydGlhbFN0YXRlIiwicmVuZGVyZWRUeXBlIiwicmVuZGVyZWRWbm9kZSIsImZpeGVkT2xkVm5vZGUiLCJ3aWxsVXBkYXRlIiwibmV3U3RhdGVMZXNzSW5zdGFuY2UiLCJuZXd2bm9kZSIsIm1vdW50Q29tcG9uZW50IiwiY29tcG9uZW50V2lsbE1vdW50IiwiaXNDYXRjaGVkIiwiX21vdW50SW5kZXgiLCJjb21wb25lbnREaWRNb3VudCIsIm1vdW50TmF0aXZlRWxlbWVudCIsIm1vdW50VGV4dENvbXBvbmVudCIsImZpeFRleHQiLCJ0ZXh0RG9tTm9kZSIsImNyZWF0ZVRleHROb2RlIiwiY2hpbGRyZW5Wbm9kZSIsImZsYXR0ZW5DaGlsZExpc3QiLCJub2RlVHlwZSIsIl9fZG9tIiwiZGVwdGgiLCJpc1VwZGF0ZSIsImZpeENvbnRleHQiLCJOZXdDaGlsZCIsIkRPTV9TSU5HTEVfTm9kZSIsIlVuaXF1ZUtleSIsInJvb3RWbm9kZSJdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FB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QTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGVBQU87QUFDUDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsMkJBQW1CLGNBQWM7QUFDakM7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQU07QUFDTjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxzQkFBYyw0QkFBNEI7QUFDMUM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQU07QUFDTjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxZQUFJOztBQUVKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0EsdUJBQWUsNEJBQTRCO0FBQzNDO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7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QUNELFdBQU9BLE9BQVA7QUFDSDs7QUFHRDs7Ozs7QUFLQSxTQUFTOUYsTUFBVCxDQUFnQmlELEtBQWhCLEVBQXVCMk4sU0FBdkIsRUFBa0M7QUFDOUIsUUFBSSx1QkFBV0EsU0FBWCxNQUEwQixDQUE5QixFQUFpQztBQUM3QixjQUFNLElBQUk1UCxLQUFKLENBQVUsd0NBQVYsQ0FBTjtBQUNIOztBQUVELFFBQU1xVSxZQUFZekUsVUFBVXlFLFNBQTVCO0FBQ0EsUUFBSXpFLFVBQVV5RSxTQUFkLEVBQXlCO0FBQUM7QUFDdEIsWUFBTTFVLFdBQVd1USxhQUFhbUUsU0FBYixDQUFqQjtBQUNBLFlBQU1DLFlBQVkxQyxPQUFPalMsUUFBUCxFQUFpQnNDLEtBQWpCLEVBQXdCMk4sU0FBeEIsQ0FBbEI7QUFDQTtBQUNBLGVBQU8zTixNQUFNMEYsU0FBYjtBQUNILEtBTEQsTUFLTztBQUNIO0FBQ0ExRixjQUFNcUgsS0FBTixHQUFjLElBQWQ7QUFDQXNHLGtCQUFVeUUsU0FBVixHQUFzQjlELGVBQXRCO0FBQ0FMLHFCQUFhTixVQUFVeUUsU0FBdkIsSUFBb0NwUyxLQUFwQztBQUNBMFAsb0JBQVkxUCxLQUFaLEVBQW1CMk4sU0FBbkIsRUFBOEIsS0FBOUIsRUFBcUMzTixNQUFNM0MsT0FBM0MsRUFBb0QyQyxNQUFNOEUsS0FBMUQ7QUFDQTtBQUNBLGVBQU85RSxNQUFNMEYsU0FBYjtBQUNIO0FBQ0o7O1FBR0dzRCxZLEdBQUFBLFk7UUFDQWtGLFksR0FBQUEsWTtRQUNBeUIsTSxHQUFBQSxNO1FBQ0E1RyxXLEdBQUFBLFc7UUFDQWhNLE0sR0FBQUEsTSIsImZpbGUiOiJidW5kbGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHRmdW5jdGlvbiBob3REaXNwb3NlQ2h1bmsoY2h1bmtJZCkge1xuIFx0XHRkZWxldGUgaW5zdGFsbGVkQ2h1bmtzW2NodW5rSWRdO1xuIFx0fVxuIFx0dmFyIHBhcmVudEhvdFVwZGF0ZUNhbGxiYWNrID0gd2luZG93W1wid2VicGFja0hvdFVwZGF0ZVwiXTtcbiBcdHdpbmRvd1tcIndlYnBhY2tIb3RVcGRhdGVcIl0gPSAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tdW51c2VkLXZhcnNcbiBcdGZ1bmN0aW9uIHdlYnBhY2tIb3RVcGRhdGVDYWxsYmFjayhjaHVua0lkLCBtb3JlTW9kdWxlcykge1xuIFx0XHRob3RBZGRVcGRhdGVDaHVuayhjaHVua0lkLCBtb3JlTW9kdWxlcyk7XG4gXHRcdGlmIChwYXJlbnRIb3RVcGRhdGVDYWxsYmFjaykgcGFyZW50SG90VXBkYXRlQ2FsbGJhY2soY2h1bmtJZCwgbW9yZU1vZHVsZXMpO1xuIFx0fSA7XG5cbiBcdC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby11bnVzZWQtdmFyc1xuIFx0ZnVuY3Rpb24gaG90RG93bmxvYWRVcGRhdGVDaHVuayhjaHVua0lkKSB7XG4gXHRcdHZhciBoZWFkID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJoZWFkXCIpWzBdO1xuIFx0XHR2YXIgc2NyaXB0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNjcmlwdFwiKTtcbiBcdFx0c2NyaXB0LmNoYXJzZXQgPSBcInV0Zi04XCI7XG4gXHRcdHNjcmlwdC5zcmMgPSBfX3dlYnBhY2tfcmVxdWlyZV9fLnAgKyBcIlwiICsgY2h1bmtJZCArIFwiLlwiICsgaG90Q3VycmVudEhhc2ggKyBcIi5ob3QtdXBkYXRlLmpzXCI7XG4gXHRcdDtcbiBcdFx0aGVhZC5hcHBlbmRDaGlsZChzY3JpcHQpO1xuIFx0fVxuXG4gXHQvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tdW51c2VkLXZhcnNcbiBcdGZ1bmN0aW9uIGhvdERvd25sb2FkTWFuaWZlc3QocmVxdWVzdFRpbWVvdXQpIHtcbiBcdFx0cmVxdWVzdFRpbWVvdXQgPSByZXF1ZXN0VGltZW91dCB8fCAxMDAwMDtcbiBcdFx0cmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xuIFx0XHRcdGlmICh0eXBlb2YgWE1MSHR0cFJlcXVlc3QgPT09IFwidW5kZWZpbmVkXCIpXG4gXHRcdFx0XHRyZXR1cm4gcmVqZWN0KG5ldyBFcnJvcihcIk5vIGJyb3dzZXIgc3VwcG9ydFwiKSk7XG4gXHRcdFx0dHJ5IHtcbiBcdFx0XHRcdHZhciByZXF1ZXN0ID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG4gXHRcdFx0XHR2YXIgcmVxdWVzdFBhdGggPSBfX3dlYnBhY2tfcmVxdWlyZV9fLnAgKyBcIlwiICsgaG90Q3VycmVudEhhc2ggKyBcIi5ob3QtdXBkYXRlLmpzb25cIjtcbiBcdFx0XHRcdHJlcXVlc3Qub3BlbihcIkdFVFwiLCByZXF1ZXN0UGF0aCwgdHJ1ZSk7XG4gXHRcdFx0XHRyZXF1ZXN0LnRpbWVvdXQgPSByZXF1ZXN0VGltZW91dDtcbiBcdFx0XHRcdHJlcXVlc3Quc2VuZChudWxsKTtcbiBcdFx0XHR9IGNhdGNoIChlcnIpIHtcbiBcdFx0XHRcdHJldHVybiByZWplY3QoZXJyKTtcbiBcdFx0XHR9XG4gXHRcdFx0cmVxdWVzdC5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBmdW5jdGlvbigpIHtcbiBcdFx0XHRcdGlmIChyZXF1ZXN0LnJlYWR5U3RhdGUgIT09IDQpIHJldHVybjtcbiBcdFx0XHRcdGlmIChyZXF1ZXN0LnN0YXR1cyA9PT0gMCkge1xuIFx0XHRcdFx0XHQvLyB0aW1lb3V0XG4gXHRcdFx0XHRcdHJlamVjdChcbiBcdFx0XHRcdFx0XHRuZXcgRXJyb3IoXCJNYW5pZmVzdCByZXF1ZXN0IHRvIFwiICsgcmVxdWVzdFBhdGggKyBcIiB0aW1lZCBvdXQuXCIpXG4gXHRcdFx0XHRcdCk7XG4gXHRcdFx0XHR9IGVsc2UgaWYgKHJlcXVlc3Quc3RhdHVzID09PSA0MDQpIHtcbiBcdFx0XHRcdFx0Ly8gbm8gdXBkYXRlIGF2YWlsYWJsZVxuIFx0XHRcdFx0XHRyZXNvbHZlKCk7XG4gXHRcdFx0XHR9IGVsc2UgaWYgKHJlcXVlc3Quc3RhdHVzICE9PSAyMDAgJiYgcmVxdWVzdC5zdGF0dXMgIT09IDMwNCkge1xuIFx0XHRcdFx0XHQvLyBvdGhlciBmYWlsdXJlXG4gXHRcdFx0XHRcdHJlamVjdChuZXcgRXJyb3IoXCJNYW5pZmVzdCByZXF1ZXN0IHRvIFwiICsgcmVxdWVzdFBhdGggKyBcIiBmYWlsZWQuXCIpKTtcbiBcdFx0XHRcdH0gZWxzZSB7XG4gXHRcdFx0XHRcdC8vIHN1Y2Nlc3NcbiBcdFx0XHRcdFx0dHJ5IHtcbiBcdFx0XHRcdFx0XHR2YXIgdXBkYXRlID0gSlNPTi5wYXJzZShyZXF1ZXN0LnJlc3BvbnNlVGV4dCk7XG4gXHRcdFx0XHRcdH0gY2F0Y2ggKGUpIHtcbiBcdFx0XHRcdFx0XHRyZWplY3QoZSk7XG4gXHRcdFx0XHRcdFx0cmV0dXJuO1xuIFx0XHRcdFx0XHR9XG4gXHRcdFx0XHRcdHJlc29sdmUodXBkYXRlKTtcbiBcdFx0XHRcdH1cbiBcdFx0XHR9O1xuIFx0XHR9KTtcbiBcdH1cblxuIFx0dmFyIGhvdEFwcGx5T25VcGRhdGUgPSB0cnVlO1xuIFx0dmFyIGhvdEN1cnJlbnRIYXNoID0gXCJmOGY2ZDk0ZDA0N2U2ZjM2YmUyNFwiOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXVudXNlZC12YXJzXG4gXHR2YXIgaG90UmVxdWVzdFRpbWVvdXQgPSAxMDAwMDtcbiBcdHZhciBob3RDdXJyZW50TW9kdWxlRGF0YSA9IHt9O1xuIFx0dmFyIGhvdEN1cnJlbnRDaGlsZE1vZHVsZTsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby11bnVzZWQtdmFyc1xuIFx0dmFyIGhvdEN1cnJlbnRQYXJlbnRzID0gW107IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tdW51c2VkLXZhcnNcbiBcdHZhciBob3RDdXJyZW50UGFyZW50c1RlbXAgPSBbXTsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby11bnVzZWQtdmFyc1xuXG4gXHQvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tdW51c2VkLXZhcnNcbiBcdGZ1bmN0aW9uIGhvdENyZWF0ZVJlcXVpcmUobW9kdWxlSWQpIHtcbiBcdFx0dmFyIG1lID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF07XG4gXHRcdGlmICghbWUpIHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fO1xuIFx0XHR2YXIgZm4gPSBmdW5jdGlvbihyZXF1ZXN0KSB7XG4gXHRcdFx0aWYgKG1lLmhvdC5hY3RpdmUpIHtcbiBcdFx0XHRcdGlmIChpbnN0YWxsZWRNb2R1bGVzW3JlcXVlc3RdKSB7XG4gXHRcdFx0XHRcdGlmIChpbnN0YWxsZWRNb2R1bGVzW3JlcXVlc3RdLnBhcmVudHMuaW5kZXhPZihtb2R1bGVJZCkgPT09IC0xKVxuIFx0XHRcdFx0XHRcdGluc3RhbGxlZE1vZHVsZXNbcmVxdWVzdF0ucGFyZW50cy5wdXNoKG1vZHVsZUlkKTtcbiBcdFx0XHRcdH0gZWxzZSB7XG4gXHRcdFx0XHRcdGhvdEN1cnJlbnRQYXJlbnRzID0gW21vZHVsZUlkXTtcbiBcdFx0XHRcdFx0aG90Q3VycmVudENoaWxkTW9kdWxlID0gcmVxdWVzdDtcbiBcdFx0XHRcdH1cbiBcdFx0XHRcdGlmIChtZS5jaGlsZHJlbi5pbmRleE9mKHJlcXVlc3QpID09PSAtMSkgbWUuY2hpbGRyZW4ucHVzaChyZXF1ZXN0KTtcbiBcdFx0XHR9IGVsc2Uge1xuIFx0XHRcdFx0Y29uc29sZS53YXJuKFxuIFx0XHRcdFx0XHRcIltITVJdIHVuZXhwZWN0ZWQgcmVxdWlyZShcIiArXG4gXHRcdFx0XHRcdFx0cmVxdWVzdCArXG4gXHRcdFx0XHRcdFx0XCIpIGZyb20gZGlzcG9zZWQgbW9kdWxlIFwiICtcbiBcdFx0XHRcdFx0XHRtb2R1bGVJZFxuIFx0XHRcdFx0KTtcbiBcdFx0XHRcdGhvdEN1cnJlbnRQYXJlbnRzID0gW107XG4gXHRcdFx0fVxuIFx0XHRcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKHJlcXVlc3QpO1xuIFx0XHR9O1xuIFx0XHR2YXIgT2JqZWN0RmFjdG9yeSA9IGZ1bmN0aW9uIE9iamVjdEZhY3RvcnkobmFtZSkge1xuIFx0XHRcdHJldHVybiB7XG4gXHRcdFx0XHRjb25maWd1cmFibGU6IHRydWUsXG4gXHRcdFx0XHRlbnVtZXJhYmxlOiB0cnVlLFxuIFx0XHRcdFx0Z2V0OiBmdW5jdGlvbigpIHtcbiBcdFx0XHRcdFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX19bbmFtZV07XG4gXHRcdFx0XHR9LFxuIFx0XHRcdFx0c2V0OiBmdW5jdGlvbih2YWx1ZSkge1xuIFx0XHRcdFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fW25hbWVdID0gdmFsdWU7XG4gXHRcdFx0XHR9XG4gXHRcdFx0fTtcbiBcdFx0fTtcbiBcdFx0Zm9yICh2YXIgbmFtZSBpbiBfX3dlYnBhY2tfcmVxdWlyZV9fKSB7XG4gXHRcdFx0aWYgKFxuIFx0XHRcdFx0T2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKF9fd2VicGFja19yZXF1aXJlX18sIG5hbWUpICYmXG4gXHRcdFx0XHRuYW1lICE9PSBcImVcIlxuIFx0XHRcdCkge1xuIFx0XHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGZuLCBuYW1lLCBPYmplY3RGYWN0b3J5KG5hbWUpKTtcbiBcdFx0XHR9XG4gXHRcdH1cbiBcdFx0Zm4uZSA9IGZ1bmN0aW9uKGNodW5rSWQpIHtcbiBcdFx0XHRpZiAoaG90U3RhdHVzID09PSBcInJlYWR5XCIpIGhvdFNldFN0YXR1cyhcInByZXBhcmVcIik7XG4gXHRcdFx0aG90Q2h1bmtzTG9hZGluZysrO1xuIFx0XHRcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fLmUoY2h1bmtJZCkudGhlbihmaW5pc2hDaHVua0xvYWRpbmcsIGZ1bmN0aW9uKGVycikge1xuIFx0XHRcdFx0ZmluaXNoQ2h1bmtMb2FkaW5nKCk7XG4gXHRcdFx0XHR0aHJvdyBlcnI7XG4gXHRcdFx0fSk7XG5cbiBcdFx0XHRmdW5jdGlvbiBmaW5pc2hDaHVua0xvYWRpbmcoKSB7XG4gXHRcdFx0XHRob3RDaHVua3NMb2FkaW5nLS07XG4gXHRcdFx0XHRpZiAoaG90U3RhdHVzID09PSBcInByZXBhcmVcIikge1xuIFx0XHRcdFx0XHRpZiAoIWhvdFdhaXRpbmdGaWxlc01hcFtjaHVua0lkXSkge1xuIFx0XHRcdFx0XHRcdGhvdEVuc3VyZVVwZGF0ZUNodW5rKGNodW5rSWQpO1xuIFx0XHRcdFx0XHR9XG4gXHRcdFx0XHRcdGlmIChob3RDaHVua3NMb2FkaW5nID09PSAwICYmIGhvdFdhaXRpbmdGaWxlcyA9PT0gMCkge1xuIFx0XHRcdFx0XHRcdGhvdFVwZGF0ZURvd25sb2FkZWQoKTtcbiBcdFx0XHRcdFx0fVxuIFx0XHRcdFx0fVxuIFx0XHRcdH1cbiBcdFx0fTtcbiBcdFx0cmV0dXJuIGZuO1xuIFx0fVxuXG4gXHQvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tdW51c2VkLXZhcnNcbiBcdGZ1bmN0aW9uIGhvdENyZWF0ZU1vZHVsZShtb2R1bGVJZCkge1xuIFx0XHR2YXIgaG90ID0ge1xuIFx0XHRcdC8vIHByaXZhdGUgc3R1ZmZcbiBcdFx0XHRfYWNjZXB0ZWREZXBlbmRlbmNpZXM6IHt9LFxuIFx0XHRcdF9kZWNsaW5lZERlcGVuZGVuY2llczoge30sXG4gXHRcdFx0X3NlbGZBY2NlcHRlZDogZmFsc2UsXG4gXHRcdFx0X3NlbGZEZWNsaW5lZDogZmFsc2UsXG4gXHRcdFx0X2Rpc3Bvc2VIYW5kbGVyczogW10sXG4gXHRcdFx0X21haW46IGhvdEN1cnJlbnRDaGlsZE1vZHVsZSAhPT0gbW9kdWxlSWQsXG5cbiBcdFx0XHQvLyBNb2R1bGUgQVBJXG4gXHRcdFx0YWN0aXZlOiB0cnVlLFxuIFx0XHRcdGFjY2VwdDogZnVuY3Rpb24oZGVwLCBjYWxsYmFjaykge1xuIFx0XHRcdFx0aWYgKHR5cGVvZiBkZXAgPT09IFwidW5kZWZpbmVkXCIpIGhvdC5fc2VsZkFjY2VwdGVkID0gdHJ1ZTtcbiBcdFx0XHRcdGVsc2UgaWYgKHR5cGVvZiBkZXAgPT09IFwiZnVuY3Rpb25cIikgaG90Ll9zZWxmQWNjZXB0ZWQgPSBkZXA7XG4gXHRcdFx0XHRlbHNlIGlmICh0eXBlb2YgZGVwID09PSBcIm9iamVjdFwiKVxuIFx0XHRcdFx0XHRmb3IgKHZhciBpID0gMDsgaSA8IGRlcC5sZW5ndGg7IGkrKylcbiBcdFx0XHRcdFx0XHRob3QuX2FjY2VwdGVkRGVwZW5kZW5jaWVzW2RlcFtpXV0gPSBjYWxsYmFjayB8fCBmdW5jdGlvbigpIHt9O1xuIFx0XHRcdFx0ZWxzZSBob3QuX2FjY2VwdGVkRGVwZW5kZW5jaWVzW2RlcF0gPSBjYWxsYmFjayB8fCBmdW5jdGlvbigpIHt9O1xuIFx0XHRcdH0sXG4gXHRcdFx0ZGVjbGluZTogZnVuY3Rpb24oZGVwKSB7XG4gXHRcdFx0XHRpZiAodHlwZW9mIGRlcCA9PT0gXCJ1bmRlZmluZWRcIikgaG90Ll9zZWxmRGVjbGluZWQgPSB0cnVlO1xuIFx0XHRcdFx0ZWxzZSBpZiAodHlwZW9mIGRlcCA9PT0gXCJvYmplY3RcIilcbiBcdFx0XHRcdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBkZXAubGVuZ3RoOyBpKyspXG4gXHRcdFx0XHRcdFx0aG90Ll9kZWNsaW5lZERlcGVuZGVuY2llc1tkZXBbaV1dID0gdHJ1ZTtcbiBcdFx0XHRcdGVsc2UgaG90Ll9kZWNsaW5lZERlcGVuZGVuY2llc1tkZXBdID0gdHJ1ZTtcbiBcdFx0XHR9LFxuIFx0XHRcdGRpc3Bvc2U6IGZ1bmN0aW9uKGNhbGxiYWNrKSB7XG4gXHRcdFx0XHRob3QuX2Rpc3Bvc2VIYW5kbGVycy5wdXNoKGNhbGxiYWNrKTtcbiBcdFx0XHR9LFxuIFx0XHRcdGFkZERpc3Bvc2VIYW5kbGVyOiBmdW5jdGlvbihjYWxsYmFjaykge1xuIFx0XHRcdFx0aG90Ll9kaXNwb3NlSGFuZGxlcnMucHVzaChjYWxsYmFjayk7XG4gXHRcdFx0fSxcbiBcdFx0XHRyZW1vdmVEaXNwb3NlSGFuZGxlcjogZnVuY3Rpb24oY2FsbGJhY2spIHtcbiBcdFx0XHRcdHZhciBpZHggPSBob3QuX2Rpc3Bvc2VIYW5kbGVycy5pbmRleE9mKGNhbGxiYWNrKTtcbiBcdFx0XHRcdGlmIChpZHggPj0gMCkgaG90Ll9kaXNwb3NlSGFuZGxlcnMuc3BsaWNlKGlkeCwgMSk7XG4gXHRcdFx0fSxcblxuIFx0XHRcdC8vIE1hbmFnZW1lbnQgQVBJXG4gXHRcdFx0Y2hlY2s6IGhvdENoZWNrLFxuIFx0XHRcdGFwcGx5OiBob3RBcHBseSxcbiBcdFx0XHRzdGF0dXM6IGZ1bmN0aW9uKGwpIHtcbiBcdFx0XHRcdGlmICghbCkgcmV0dXJuIGhvdFN0YXR1cztcbiBcdFx0XHRcdGhvdFN0YXR1c0hhbmRsZXJzLnB1c2gobCk7XG4gXHRcdFx0fSxcbiBcdFx0XHRhZGRTdGF0dXNIYW5kbGVyOiBmdW5jdGlvbihsKSB7XG4gXHRcdFx0XHRob3RTdGF0dXNIYW5kbGVycy5wdXNoKGwpO1xuIFx0XHRcdH0sXG4gXHRcdFx0cmVtb3ZlU3RhdHVzSGFuZGxlcjogZnVuY3Rpb24obCkge1xuIFx0XHRcdFx0dmFyIGlkeCA9IGhvdFN0YXR1c0hhbmRsZXJzLmluZGV4T2YobCk7XG4gXHRcdFx0XHRpZiAoaWR4ID49IDApIGhvdFN0YXR1c0hhbmRsZXJzLnNwbGljZShpZHgsIDEpO1xuIFx0XHRcdH0sXG5cbiBcdFx0XHQvL2luaGVyaXQgZnJvbSBwcmV2aW91cyBkaXNwb3NlIGNhbGxcbiBcdFx0XHRkYXRhOiBob3RDdXJyZW50TW9kdWxlRGF0YVttb2R1bGVJZF1cbiBcdFx0fTtcbiBcdFx0aG90Q3VycmVudENoaWxkTW9kdWxlID0gdW5kZWZpbmVkO1xuIFx0XHRyZXR1cm4gaG90O1xuIFx0fVxuXG4gXHR2YXIgaG90U3RhdHVzSGFuZGxlcnMgPSBbXTtcbiBcdHZhciBob3RTdGF0dXMgPSBcImlkbGVcIjtcblxuIFx0ZnVuY3Rpb24gaG90U2V0U3RhdHVzKG5ld1N0YXR1cykge1xuIFx0XHRob3RTdGF0dXMgPSBuZXdTdGF0dXM7XG4gXHRcdGZvciAodmFyIGkgPSAwOyBpIDwgaG90U3RhdHVzSGFuZGxlcnMubGVuZ3RoOyBpKyspXG4gXHRcdFx0aG90U3RhdHVzSGFuZGxlcnNbaV0uY2FsbChudWxsLCBuZXdTdGF0dXMpO1xuIFx0fVxuXG4gXHQvLyB3aGlsZSBkb3dubG9hZGluZ1xuIFx0dmFyIGhvdFdhaXRpbmdGaWxlcyA9IDA7XG4gXHR2YXIgaG90Q2h1bmtzTG9hZGluZyA9IDA7XG4gXHR2YXIgaG90V2FpdGluZ0ZpbGVzTWFwID0ge307XG4gXHR2YXIgaG90UmVxdWVzdGVkRmlsZXNNYXAgPSB7fTtcbiBcdHZhciBob3RBdmFpbGFibGVGaWxlc01hcCA9IHt9O1xuIFx0dmFyIGhvdERlZmVycmVkO1xuXG4gXHQvLyBUaGUgdXBkYXRlIGluZm9cbiBcdHZhciBob3RVcGRhdGUsIGhvdFVwZGF0ZU5ld0hhc2g7XG5cbiBcdGZ1bmN0aW9uIHRvTW9kdWxlSWQoaWQpIHtcbiBcdFx0dmFyIGlzTnVtYmVyID0gK2lkICsgXCJcIiA9PT0gaWQ7XG4gXHRcdHJldHVybiBpc051bWJlciA/ICtpZCA6IGlkO1xuIFx0fVxuXG4gXHRmdW5jdGlvbiBob3RDaGVjayhhcHBseSkge1xuIFx0XHRpZiAoaG90U3RhdHVzICE9PSBcImlkbGVcIilcbiBcdFx0XHR0aHJvdyBuZXcgRXJyb3IoXCJjaGVjaygpIGlzIG9ubHkgYWxsb3dlZCBpbiBpZGxlIHN0YXR1c1wiKTtcbiBcdFx0aG90QXBwbHlPblVwZGF0ZSA9IGFwcGx5O1xuIFx0XHRob3RTZXRTdGF0dXMoXCJjaGVja1wiKTtcbiBcdFx0cmV0dXJuIGhvdERvd25sb2FkTWFuaWZlc3QoaG90UmVxdWVzdFRpbWVvdXQpLnRoZW4oZnVuY3Rpb24odXBkYXRlKSB7XG4gXHRcdFx0aWYgKCF1cGRhdGUpIHtcbiBcdFx0XHRcdGhvdFNldFN0YXR1cyhcImlkbGVcIik7XG4gXHRcdFx0XHRyZXR1cm4gbnVsbDtcbiBcdFx0XHR9XG4gXHRcdFx0aG90UmVxdWVzdGVkRmlsZXNNYXAgPSB7fTtcbiBcdFx0XHRob3RXYWl0aW5nRmlsZXNNYXAgPSB7fTtcbiBcdFx0XHRob3RBdmFpbGFibGVGaWxlc01hcCA9IHVwZGF0ZS5jO1xuIFx0XHRcdGhvdFVwZGF0ZU5ld0hhc2ggPSB1cGRhdGUuaDtcblxuIFx0XHRcdGhvdFNldFN0YXR1cyhcInByZXBhcmVcIik7XG4gXHRcdFx0dmFyIHByb21pc2UgPSBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcbiBcdFx0XHRcdGhvdERlZmVycmVkID0ge1xuIFx0XHRcdFx0XHRyZXNvbHZlOiByZXNvbHZlLFxuIFx0XHRcdFx0XHRyZWplY3Q6IHJlamVjdFxuIFx0XHRcdFx0fTtcbiBcdFx0XHR9KTtcbiBcdFx0XHRob3RVcGRhdGUgPSB7fTtcbiBcdFx0XHR2YXIgY2h1bmtJZCA9IFwibWFpblwiO1xuIFx0XHRcdHtcbiBcdFx0XHRcdC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tbG9uZS1ibG9ja3NcbiBcdFx0XHRcdC8qZ2xvYmFscyBjaHVua0lkICovXG4gXHRcdFx0XHRob3RFbnN1cmVVcGRhdGVDaHVuayhjaHVua0lkKTtcbiBcdFx0XHR9XG4gXHRcdFx0aWYgKFxuIFx0XHRcdFx0aG90U3RhdHVzID09PSBcInByZXBhcmVcIiAmJlxuIFx0XHRcdFx0aG90Q2h1bmtzTG9hZGluZyA9PT0gMCAmJlxuIFx0XHRcdFx0aG90V2FpdGluZ0ZpbGVzID09PSAwXG4gXHRcdFx0KSB7XG4gXHRcdFx0XHRob3RVcGRhdGVEb3dubG9hZGVkKCk7XG4gXHRcdFx0fVxuIFx0XHRcdHJldHVybiBwcm9taXNlO1xuIFx0XHR9KTtcbiBcdH1cblxuIFx0Ly8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXVudXNlZC12YXJzXG4gXHRmdW5jdGlvbiBob3RBZGRVcGRhdGVDaHVuayhjaHVua0lkLCBtb3JlTW9kdWxlcykge1xuIFx0XHRpZiAoIWhvdEF2YWlsYWJsZUZpbGVzTWFwW2NodW5rSWRdIHx8ICFob3RSZXF1ZXN0ZWRGaWxlc01hcFtjaHVua0lkXSlcbiBcdFx0XHRyZXR1cm47XG4gXHRcdGhvdFJlcXVlc3RlZEZpbGVzTWFwW2NodW5rSWRdID0gZmFsc2U7XG4gXHRcdGZvciAodmFyIG1vZHVsZUlkIGluIG1vcmVNb2R1bGVzKSB7XG4gXHRcdFx0aWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChtb3JlTW9kdWxlcywgbW9kdWxlSWQpKSB7XG4gXHRcdFx0XHRob3RVcGRhdGVbbW9kdWxlSWRdID0gbW9yZU1vZHVsZXNbbW9kdWxlSWRdO1xuIFx0XHRcdH1cbiBcdFx0fVxuIFx0XHRpZiAoLS1ob3RXYWl0aW5nRmlsZXMgPT09IDAgJiYgaG90Q2h1bmtzTG9hZGluZyA9PT0gMCkge1xuIFx0XHRcdGhvdFVwZGF0ZURvd25sb2FkZWQoKTtcbiBcdFx0fVxuIFx0fVxuXG4gXHRmdW5jdGlvbiBob3RFbnN1cmVVcGRhdGVDaHVuayhjaHVua0lkKSB7XG4gXHRcdGlmICghaG90QXZhaWxhYmxlRmlsZXNNYXBbY2h1bmtJZF0pIHtcbiBcdFx0XHRob3RXYWl0aW5nRmlsZXNNYXBbY2h1bmtJZF0gPSB0cnVlO1xuIFx0XHR9IGVsc2Uge1xuIFx0XHRcdGhvdFJlcXVlc3RlZEZpbGVzTWFwW2NodW5rSWRdID0gdHJ1ZTtcbiBcdFx0XHRob3RXYWl0aW5nRmlsZXMrKztcbiBcdFx0XHRob3REb3dubG9hZFVwZGF0ZUNodW5rKGNodW5rSWQpO1xuIFx0XHR9XG4gXHR9XG5cbiBcdGZ1bmN0aW9uIGhvdFVwZGF0ZURvd25sb2FkZWQoKSB7XG4gXHRcdGhvdFNldFN0YXR1cyhcInJlYWR5XCIpO1xuIFx0XHR2YXIgZGVmZXJyZWQgPSBob3REZWZlcnJlZDtcbiBcdFx0aG90RGVmZXJyZWQgPSBudWxsO1xuIFx0XHRpZiAoIWRlZmVycmVkKSByZXR1cm47XG4gXHRcdGlmIChob3RBcHBseU9uVXBkYXRlKSB7XG4gXHRcdFx0Ly8gV3JhcCBkZWZlcnJlZCBvYmplY3QgaW4gUHJvbWlzZSB0byBtYXJrIGl0IGFzIGEgd2VsbC1oYW5kbGVkIFByb21pc2UgdG9cbiBcdFx0XHQvLyBhdm9pZCB0cmlnZ2VyaW5nIHVuY2F1Z2h0IGV4Y2VwdGlvbiB3YXJuaW5nIGluIENocm9tZS5cbiBcdFx0XHQvLyBTZWUgaHR0cHM6Ly9idWdzLmNocm9taXVtLm9yZy9wL2Nocm9taXVtL2lzc3Vlcy9kZXRhaWw/aWQ9NDY1NjY2XG4gXHRcdFx0UHJvbWlzZS5yZXNvbHZlKClcbiBcdFx0XHRcdC50aGVuKGZ1bmN0aW9uKCkge1xuIFx0XHRcdFx0XHRyZXR1cm4gaG90QXBwbHkoaG90QXBwbHlPblVwZGF0ZSk7XG4gXHRcdFx0XHR9KVxuIFx0XHRcdFx0LnRoZW4oXG4gXHRcdFx0XHRcdGZ1bmN0aW9uKHJlc3VsdCkge1xuIFx0XHRcdFx0XHRcdGRlZmVycmVkLnJlc29sdmUocmVzdWx0KTtcbiBcdFx0XHRcdFx0fSxcbiBcdFx0XHRcdFx0ZnVuY3Rpb24oZXJyKSB7XG4gXHRcdFx0XHRcdFx0ZGVmZXJyZWQucmVqZWN0KGVycik7XG4gXHRcdFx0XHRcdH1cbiBcdFx0XHRcdCk7XG4gXHRcdH0gZWxzZSB7XG4gXHRcdFx0dmFyIG91dGRhdGVkTW9kdWxlcyA9IFtdO1xuIFx0XHRcdGZvciAodmFyIGlkIGluIGhvdFVwZGF0ZSkge1xuIFx0XHRcdFx0aWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChob3RVcGRhdGUsIGlkKSkge1xuIFx0XHRcdFx0XHRvdXRkYXRlZE1vZHVsZXMucHVzaCh0b01vZHVsZUlkKGlkKSk7XG4gXHRcdFx0XHR9XG4gXHRcdFx0fVxuIFx0XHRcdGRlZmVycmVkLnJlc29sdmUob3V0ZGF0ZWRNb2R1bGVzKTtcbiBcdFx0fVxuIFx0fVxuXG4gXHRmdW5jdGlvbiBob3RBcHBseShvcHRpb25zKSB7XG4gXHRcdGlmIChob3RTdGF0dXMgIT09IFwicmVhZHlcIilcbiBcdFx0XHR0aHJvdyBuZXcgRXJyb3IoXCJhcHBseSgpIGlzIG9ubHkgYWxsb3dlZCBpbiByZWFkeSBzdGF0dXNcIik7XG4gXHRcdG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuXG4gXHRcdHZhciBjYjtcbiBcdFx0dmFyIGk7XG4gXHRcdHZhciBqO1xuIFx0XHR2YXIgbW9kdWxlO1xuIFx0XHR2YXIgbW9kdWxlSWQ7XG5cbiBcdFx0ZnVuY3Rpb24gZ2V0QWZmZWN0ZWRTdHVmZih1cGRhdGVNb2R1bGVJZCkge1xuIFx0XHRcdHZhciBvdXRkYXRlZE1vZHVsZXMgPSBbdXBkYXRlTW9kdWxlSWRdO1xuIFx0XHRcdHZhciBvdXRkYXRlZERlcGVuZGVuY2llcyA9IHt9O1xuXG4gXHRcdFx0dmFyIHF1ZXVlID0gb3V0ZGF0ZWRNb2R1bGVzLnNsaWNlKCkubWFwKGZ1bmN0aW9uKGlkKSB7XG4gXHRcdFx0XHRyZXR1cm4ge1xuIFx0XHRcdFx0XHRjaGFpbjogW2lkXSxcbiBcdFx0XHRcdFx0aWQ6IGlkXG4gXHRcdFx0XHR9O1xuIFx0XHRcdH0pO1xuIFx0XHRcdHdoaWxlIChxdWV1ZS5sZW5ndGggPiAwKSB7XG4gXHRcdFx0XHR2YXIgcXVldWVJdGVtID0gcXVldWUucG9wKCk7XG4gXHRcdFx0XHR2YXIgbW9kdWxlSWQgPSBxdWV1ZUl0ZW0uaWQ7XG4gXHRcdFx0XHR2YXIgY2hhaW4gPSBxdWV1ZUl0ZW0uY2hhaW47XG4gXHRcdFx0XHRtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXTtcbiBcdFx0XHRcdGlmICghbW9kdWxlIHx8IG1vZHVsZS5ob3QuX3NlbGZBY2NlcHRlZCkgY29udGludWU7XG4gXHRcdFx0XHRpZiAobW9kdWxlLmhvdC5fc2VsZkRlY2xpbmVkKSB7XG4gXHRcdFx0XHRcdHJldHVybiB7XG4gXHRcdFx0XHRcdFx0dHlwZTogXCJzZWxmLWRlY2xpbmVkXCIsXG4gXHRcdFx0XHRcdFx0Y2hhaW46IGNoYWluLFxuIFx0XHRcdFx0XHRcdG1vZHVsZUlkOiBtb2R1bGVJZFxuIFx0XHRcdFx0XHR9O1xuIFx0XHRcdFx0fVxuIFx0XHRcdFx0aWYgKG1vZHVsZS5ob3QuX21haW4pIHtcbiBcdFx0XHRcdFx0cmV0dXJuIHtcbiBcdFx0XHRcdFx0XHR0eXBlOiBcInVuYWNjZXB0ZWRcIixcbiBcdFx0XHRcdFx0XHRjaGFpbjogY2hhaW4sXG4gXHRcdFx0XHRcdFx0bW9kdWxlSWQ6IG1vZHVsZUlkXG4gXHRcdFx0XHRcdH07XG4gXHRcdFx0XHR9XG4gXHRcdFx0XHRmb3IgKHZhciBpID0gMDsgaSA8IG1vZHVsZS5wYXJlbnRzLmxlbmd0aDsgaSsrKSB7XG4gXHRcdFx0XHRcdHZhciBwYXJlbnRJZCA9IG1vZHVsZS5wYXJlbnRzW2ldO1xuIFx0XHRcdFx0XHR2YXIgcGFyZW50ID0gaW5zdGFsbGVkTW9kdWxlc1twYXJlbnRJZF07XG4gXHRcdFx0XHRcdGlmICghcGFyZW50KSBjb250aW51ZTtcbiBcdFx0XHRcdFx0aWYgKHBhcmVudC5ob3QuX2RlY2xpbmVkRGVwZW5kZW5jaWVzW21vZHVsZUlkXSkge1xuIFx0XHRcdFx0XHRcdHJldHVybiB7XG4gXHRcdFx0XHRcdFx0XHR0eXBlOiBcImRlY2xpbmVkXCIsXG4gXHRcdFx0XHRcdFx0XHRjaGFpbjogY2hhaW4uY29uY2F0KFtwYXJlbnRJZF0pLFxuIFx0XHRcdFx0XHRcdFx0bW9kdWxlSWQ6IG1vZHVsZUlkLFxuIFx0XHRcdFx0XHRcdFx0cGFyZW50SWQ6IHBhcmVudElkXG4gXHRcdFx0XHRcdFx0fTtcbiBcdFx0XHRcdFx0fVxuIFx0XHRcdFx0XHRpZiAob3V0ZGF0ZWRNb2R1bGVzLmluZGV4T2YocGFyZW50SWQpICE9PSAtMSkgY29udGludWU7XG4gXHRcdFx0XHRcdGlmIChwYXJlbnQuaG90Ll9hY2NlcHRlZERlcGVuZGVuY2llc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRcdFx0XHRpZiAoIW91dGRhdGVkRGVwZW5kZW5jaWVzW3BhcmVudElkXSlcbiBcdFx0XHRcdFx0XHRcdG91dGRhdGVkRGVwZW5kZW5jaWVzW3BhcmVudElkXSA9IFtdO1xuIFx0XHRcdFx0XHRcdGFkZEFsbFRvU2V0KG91dGRhdGVkRGVwZW5kZW5jaWVzW3BhcmVudElkXSwgW21vZHVsZUlkXSk7XG4gXHRcdFx0XHRcdFx0Y29udGludWU7XG4gXHRcdFx0XHRcdH1cbiBcdFx0XHRcdFx0ZGVsZXRlIG91dGRhdGVkRGVwZW5kZW5jaWVzW3BhcmVudElkXTtcbiBcdFx0XHRcdFx0b3V0ZGF0ZWRNb2R1bGVzLnB1c2gocGFyZW50SWQpO1xuIFx0XHRcdFx0XHRxdWV1ZS5wdXNoKHtcbiBcdFx0XHRcdFx0XHRjaGFpbjogY2hhaW4uY29uY2F0KFtwYXJlbnRJZF0pLFxuIFx0XHRcdFx0XHRcdGlkOiBwYXJlbnRJZFxuIFx0XHRcdFx0XHR9KTtcbiBcdFx0XHRcdH1cbiBcdFx0XHR9XG5cbiBcdFx0XHRyZXR1cm4ge1xuIFx0XHRcdFx0dHlwZTogXCJhY2NlcHRlZFwiLFxuIFx0XHRcdFx0bW9kdWxlSWQ6IHVwZGF0ZU1vZHVsZUlkLFxuIFx0XHRcdFx0b3V0ZGF0ZWRNb2R1bGVzOiBvdXRkYXRlZE1vZHVsZXMsXG4gXHRcdFx0XHRvdXRkYXRlZERlcGVuZGVuY2llczogb3V0ZGF0ZWREZXBlbmRlbmNpZXNcbiBcdFx0XHR9O1xuIFx0XHR9XG5cbiBcdFx0ZnVuY3Rpb24gYWRkQWxsVG9TZXQoYSwgYikge1xuIFx0XHRcdGZvciAodmFyIGkgPSAwOyBpIDwgYi5sZW5ndGg7IGkrKykge1xuIFx0XHRcdFx0dmFyIGl0ZW0gPSBiW2ldO1xuIFx0XHRcdFx0aWYgKGEuaW5kZXhPZihpdGVtKSA9PT0gLTEpIGEucHVzaChpdGVtKTtcbiBcdFx0XHR9XG4gXHRcdH1cblxuIFx0XHQvLyBhdCBiZWdpbiBhbGwgdXBkYXRlcyBtb2R1bGVzIGFyZSBvdXRkYXRlZFxuIFx0XHQvLyB0aGUgXCJvdXRkYXRlZFwiIHN0YXR1cyBjYW4gcHJvcGFnYXRlIHRvIHBhcmVudHMgaWYgdGhleSBkb24ndCBhY2NlcHQgdGhlIGNoaWxkcmVuXG4gXHRcdHZhciBvdXRkYXRlZERlcGVuZGVuY2llcyA9IHt9O1xuIFx0XHR2YXIgb3V0ZGF0ZWRNb2R1bGVzID0gW107XG4gXHRcdHZhciBhcHBsaWVkVXBkYXRlID0ge307XG5cbiBcdFx0dmFyIHdhcm5VbmV4cGVjdGVkUmVxdWlyZSA9IGZ1bmN0aW9uIHdhcm5VbmV4cGVjdGVkUmVxdWlyZSgpIHtcbiBcdFx0XHRjb25zb2xlLndhcm4oXG4gXHRcdFx0XHRcIltITVJdIHVuZXhwZWN0ZWQgcmVxdWlyZShcIiArIHJlc3VsdC5tb2R1bGVJZCArIFwiKSB0byBkaXNwb3NlZCBtb2R1bGVcIlxuIFx0XHRcdCk7XG4gXHRcdH07XG5cbiBcdFx0Zm9yICh2YXIgaWQgaW4gaG90VXBkYXRlKSB7XG4gXHRcdFx0aWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChob3RVcGRhdGUsIGlkKSkge1xuIFx0XHRcdFx0bW9kdWxlSWQgPSB0b01vZHVsZUlkKGlkKTtcbiBcdFx0XHRcdHZhciByZXN1bHQ7XG4gXHRcdFx0XHRpZiAoaG90VXBkYXRlW2lkXSkge1xuIFx0XHRcdFx0XHRyZXN1bHQgPSBnZXRBZmZlY3RlZFN0dWZmKG1vZHVsZUlkKTtcbiBcdFx0XHRcdH0gZWxzZSB7XG4gXHRcdFx0XHRcdHJlc3VsdCA9IHtcbiBcdFx0XHRcdFx0XHR0eXBlOiBcImRpc3Bvc2VkXCIsXG4gXHRcdFx0XHRcdFx0bW9kdWxlSWQ6IGlkXG4gXHRcdFx0XHRcdH07XG4gXHRcdFx0XHR9XG4gXHRcdFx0XHR2YXIgYWJvcnRFcnJvciA9IGZhbHNlO1xuIFx0XHRcdFx0dmFyIGRvQXBwbHkgPSBmYWxzZTtcbiBcdFx0XHRcdHZhciBkb0Rpc3Bvc2UgPSBmYWxzZTtcbiBcdFx0XHRcdHZhciBjaGFpbkluZm8gPSBcIlwiO1xuIFx0XHRcdFx0aWYgKHJlc3VsdC5jaGFpbikge1xuIFx0XHRcdFx0XHRjaGFpbkluZm8gPSBcIlxcblVwZGF0ZSBwcm9wYWdhdGlvbjogXCIgKyByZXN1bHQuY2hhaW4uam9pbihcIiAtPiBcIik7XG4gXHRcdFx0XHR9XG4gXHRcdFx0XHRzd2l0Y2ggKHJlc3VsdC50eXBlKSB7XG4gXHRcdFx0XHRcdGNhc2UgXCJzZWxmLWRlY2xpbmVkXCI6XG4gXHRcdFx0XHRcdFx0aWYgKG9wdGlvbnMub25EZWNsaW5lZCkgb3B0aW9ucy5vbkRlY2xpbmVkKHJlc3VsdCk7XG4gXHRcdFx0XHRcdFx0aWYgKCFvcHRpb25zLmlnbm9yZURlY2xpbmVkKVxuIFx0XHRcdFx0XHRcdFx0YWJvcnRFcnJvciA9IG5ldyBFcnJvcihcbiBcdFx0XHRcdFx0XHRcdFx0XCJBYm9ydGVkIGJlY2F1c2Ugb2Ygc2VsZiBkZWNsaW5lOiBcIiArXG4gXHRcdFx0XHRcdFx0XHRcdFx0cmVzdWx0Lm1vZHVsZUlkICtcbiBcdFx0XHRcdFx0XHRcdFx0XHRjaGFpbkluZm9cbiBcdFx0XHRcdFx0XHRcdCk7XG4gXHRcdFx0XHRcdFx0YnJlYWs7XG4gXHRcdFx0XHRcdGNhc2UgXCJkZWNsaW5lZFwiOlxuIFx0XHRcdFx0XHRcdGlmIChvcHRpb25zLm9uRGVjbGluZWQpIG9wdGlvbnMub25EZWNsaW5lZChyZXN1bHQpO1xuIFx0XHRcdFx0XHRcdGlmICghb3B0aW9ucy5pZ25vcmVEZWNsaW5lZClcbiBcdFx0XHRcdFx0XHRcdGFib3J0RXJyb3IgPSBuZXcgRXJyb3IoXG4gXHRcdFx0XHRcdFx0XHRcdFwiQWJvcnRlZCBiZWNhdXNlIG9mIGRlY2xpbmVkIGRlcGVuZGVuY3k6IFwiICtcbiBcdFx0XHRcdFx0XHRcdFx0XHRyZXN1bHQubW9kdWxlSWQgK1xuIFx0XHRcdFx0XHRcdFx0XHRcdFwiIGluIFwiICtcbiBcdFx0XHRcdFx0XHRcdFx0XHRyZXN1bHQucGFyZW50SWQgK1xuIFx0XHRcdFx0XHRcdFx0XHRcdGNoYWluSW5mb1xuIFx0XHRcdFx0XHRcdFx0KTtcbiBcdFx0XHRcdFx0XHRicmVhaztcbiBcdFx0XHRcdFx0Y2FzZSBcInVuYWNjZXB0ZWRcIjpcbiBcdFx0XHRcdFx0XHRpZiAob3B0aW9ucy5vblVuYWNjZXB0ZWQpIG9wdGlvbnMub25VbmFjY2VwdGVkKHJlc3VsdCk7XG4gXHRcdFx0XHRcdFx0aWYgKCFvcHRpb25zLmlnbm9yZVVuYWNjZXB0ZWQpXG4gXHRcdFx0XHRcdFx0XHRhYm9ydEVycm9yID0gbmV3IEVycm9yKFxuIFx0XHRcdFx0XHRcdFx0XHRcIkFib3J0ZWQgYmVjYXVzZSBcIiArIG1vZHVsZUlkICsgXCIgaXMgbm90IGFjY2VwdGVkXCIgKyBjaGFpbkluZm9cbiBcdFx0XHRcdFx0XHRcdCk7XG4gXHRcdFx0XHRcdFx0YnJlYWs7XG4gXHRcdFx0XHRcdGNhc2UgXCJhY2NlcHRlZFwiOlxuIFx0XHRcdFx0XHRcdGlmIChvcHRpb25zLm9uQWNjZXB0ZWQpIG9wdGlvbnMub25BY2NlcHRlZChyZXN1bHQpO1xuIFx0XHRcdFx0XHRcdGRvQXBwbHkgPSB0cnVlO1xuIFx0XHRcdFx0XHRcdGJyZWFrO1xuIFx0XHRcdFx0XHRjYXNlIFwiZGlzcG9zZWRcIjpcbiBcdFx0XHRcdFx0XHRpZiAob3B0aW9ucy5vbkRpc3Bvc2VkKSBvcHRpb25zLm9uRGlzcG9zZWQocmVzdWx0KTtcbiBcdFx0XHRcdFx0XHRkb0Rpc3Bvc2UgPSB0cnVlO1xuIFx0XHRcdFx0XHRcdGJyZWFrO1xuIFx0XHRcdFx0XHRkZWZhdWx0OlxuIFx0XHRcdFx0XHRcdHRocm93IG5ldyBFcnJvcihcIlVuZXhjZXB0aW9uIHR5cGUgXCIgKyByZXN1bHQudHlwZSk7XG4gXHRcdFx0XHR9XG4gXHRcdFx0XHRpZiAoYWJvcnRFcnJvcikge1xuIFx0XHRcdFx0XHRob3RTZXRTdGF0dXMoXCJhYm9ydFwiKTtcbiBcdFx0XHRcdFx0cmV0dXJuIFByb21pc2UucmVqZWN0KGFib3J0RXJyb3IpO1xuIFx0XHRcdFx0fVxuIFx0XHRcdFx0aWYgKGRvQXBwbHkpIHtcbiBcdFx0XHRcdFx0YXBwbGllZFVwZGF0ZVttb2R1bGVJZF0gPSBob3RVcGRhdGVbbW9kdWxlSWRdO1xuIFx0XHRcdFx0XHRhZGRBbGxUb1NldChvdXRkYXRlZE1vZHVsZXMsIHJlc3VsdC5vdXRkYXRlZE1vZHVsZXMpO1xuIFx0XHRcdFx0XHRmb3IgKG1vZHVsZUlkIGluIHJlc3VsdC5vdXRkYXRlZERlcGVuZGVuY2llcykge1xuIFx0XHRcdFx0XHRcdGlmIChcbiBcdFx0XHRcdFx0XHRcdE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChcbiBcdFx0XHRcdFx0XHRcdFx0cmVzdWx0Lm91dGRhdGVkRGVwZW5kZW5jaWVzLFxuIFx0XHRcdFx0XHRcdFx0XHRtb2R1bGVJZFxuIFx0XHRcdFx0XHRcdFx0KVxuIFx0XHRcdFx0XHRcdCkge1xuIFx0XHRcdFx0XHRcdFx0aWYgKCFvdXRkYXRlZERlcGVuZGVuY2llc1ttb2R1bGVJZF0pXG4gXHRcdFx0XHRcdFx0XHRcdG91dGRhdGVkRGVwZW5kZW5jaWVzW21vZHVsZUlkXSA9IFtdO1xuIFx0XHRcdFx0XHRcdFx0YWRkQWxsVG9TZXQoXG4gXHRcdFx0XHRcdFx0XHRcdG91dGRhdGVkRGVwZW5kZW5jaWVzW21vZHVsZUlkXSxcbiBcdFx0XHRcdFx0XHRcdFx0cmVzdWx0Lm91dGRhdGVkRGVwZW5kZW5jaWVzW21vZHVsZUlkXVxuIFx0XHRcdFx0XHRcdFx0KTtcbiBcdFx0XHRcdFx0XHR9XG4gXHRcdFx0XHRcdH1cbiBcdFx0XHRcdH1cbiBcdFx0XHRcdGlmIChkb0Rpc3Bvc2UpIHtcbiBcdFx0XHRcdFx0YWRkQWxsVG9TZXQob3V0ZGF0ZWRNb2R1bGVzLCBbcmVzdWx0Lm1vZHVsZUlkXSk7XG4gXHRcdFx0XHRcdGFwcGxpZWRVcGRhdGVbbW9kdWxlSWRdID0gd2FyblVuZXhwZWN0ZWRSZXF1aXJlO1xuIFx0XHRcdFx0fVxuIFx0XHRcdH1cbiBcdFx0fVxuXG4gXHRcdC8vIFN0b3JlIHNlbGYgYWNjZXB0ZWQgb3V0ZGF0ZWQgbW9kdWxlcyB0byByZXF1aXJlIHRoZW0gbGF0ZXIgYnkgdGhlIG1vZHVsZSBzeXN0ZW1cbiBcdFx0dmFyIG91dGRhdGVkU2VsZkFjY2VwdGVkTW9kdWxlcyA9IFtdO1xuIFx0XHRmb3IgKGkgPSAwOyBpIDwgb3V0ZGF0ZWRNb2R1bGVzLmxlbmd0aDsgaSsrKSB7XG4gXHRcdFx0bW9kdWxlSWQgPSBvdXRkYXRlZE1vZHVsZXNbaV07XG4gXHRcdFx0aWYgKFxuIFx0XHRcdFx0aW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gJiZcbiBcdFx0XHRcdGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmhvdC5fc2VsZkFjY2VwdGVkXG4gXHRcdFx0KVxuIFx0XHRcdFx0b3V0ZGF0ZWRTZWxmQWNjZXB0ZWRNb2R1bGVzLnB1c2goe1xuIFx0XHRcdFx0XHRtb2R1bGU6IG1vZHVsZUlkLFxuIFx0XHRcdFx0XHRlcnJvckhhbmRsZXI6IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmhvdC5fc2VsZkFjY2VwdGVkXG4gXHRcdFx0XHR9KTtcbiBcdFx0fVxuXG4gXHRcdC8vIE5vdyBpbiBcImRpc3Bvc2VcIiBwaGFzZVxuIFx0XHRob3RTZXRTdGF0dXMoXCJkaXNwb3NlXCIpO1xuIFx0XHRPYmplY3Qua2V5cyhob3RBdmFpbGFibGVGaWxlc01hcCkuZm9yRWFjaChmdW5jdGlvbihjaHVua0lkKSB7XG4gXHRcdFx0aWYgKGhvdEF2YWlsYWJsZUZpbGVzTWFwW2NodW5rSWRdID09PSBmYWxzZSkge1xuIFx0XHRcdFx0aG90RGlzcG9zZUNodW5rKGNodW5rSWQpO1xuIFx0XHRcdH1cbiBcdFx0fSk7XG5cbiBcdFx0dmFyIGlkeDtcbiBcdFx0dmFyIHF1ZXVlID0gb3V0ZGF0ZWRNb2R1bGVzLnNsaWNlKCk7XG4gXHRcdHdoaWxlIChxdWV1ZS5sZW5ndGggPiAwKSB7XG4gXHRcdFx0bW9kdWxlSWQgPSBxdWV1ZS5wb3AoKTtcbiBcdFx0XHRtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXTtcbiBcdFx0XHRpZiAoIW1vZHVsZSkgY29udGludWU7XG5cbiBcdFx0XHR2YXIgZGF0YSA9IHt9O1xuXG4gXHRcdFx0Ly8gQ2FsbCBkaXNwb3NlIGhhbmRsZXJzXG4gXHRcdFx0dmFyIGRpc3Bvc2VIYW5kbGVycyA9IG1vZHVsZS5ob3QuX2Rpc3Bvc2VIYW5kbGVycztcbiBcdFx0XHRmb3IgKGogPSAwOyBqIDwgZGlzcG9zZUhhbmRsZXJzLmxlbmd0aDsgaisrKSB7XG4gXHRcdFx0XHRjYiA9IGRpc3Bvc2VIYW5kbGVyc1tqXTtcbiBcdFx0XHRcdGNiKGRhdGEpO1xuIFx0XHRcdH1cbiBcdFx0XHRob3RDdXJyZW50TW9kdWxlRGF0YVttb2R1bGVJZF0gPSBkYXRhO1xuXG4gXHRcdFx0Ly8gZGlzYWJsZSBtb2R1bGUgKHRoaXMgZGlzYWJsZXMgcmVxdWlyZXMgZnJvbSB0aGlzIG1vZHVsZSlcbiBcdFx0XHRtb2R1bGUuaG90LmFjdGl2ZSA9IGZhbHNlO1xuXG4gXHRcdFx0Ly8gcmVtb3ZlIG1vZHVsZSBmcm9tIGNhY2hlXG4gXHRcdFx0ZGVsZXRlIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdO1xuXG4gXHRcdFx0Ly8gd2hlbiBkaXNwb3NpbmcgdGhlcmUgaXMgbm8gbmVlZCB0byBjYWxsIGRpc3Bvc2UgaGFuZGxlclxuIFx0XHRcdGRlbGV0ZSBvdXRkYXRlZERlcGVuZGVuY2llc1ttb2R1bGVJZF07XG5cbiBcdFx0XHQvLyByZW1vdmUgXCJwYXJlbnRzXCIgcmVmZXJlbmNlcyBmcm9tIGFsbCBjaGlsZHJlblxuIFx0XHRcdGZvciAoaiA9IDA7IGogPCBtb2R1bGUuY2hpbGRyZW4ubGVuZ3RoOyBqKyspIHtcbiBcdFx0XHRcdHZhciBjaGlsZCA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlLmNoaWxkcmVuW2pdXTtcbiBcdFx0XHRcdGlmICghY2hpbGQpIGNvbnRpbnVlO1xuIFx0XHRcdFx0aWR4ID0gY2hpbGQucGFyZW50cy5pbmRleE9mKG1vZHVsZUlkKTtcbiBcdFx0XHRcdGlmIChpZHggPj0gMCkge1xuIFx0XHRcdFx0XHRjaGlsZC5wYXJlbnRzLnNwbGljZShpZHgsIDEpO1xuIFx0XHRcdFx0fVxuIFx0XHRcdH1cbiBcdFx0fVxuXG4gXHRcdC8vIHJlbW92ZSBvdXRkYXRlZCBkZXBlbmRlbmN5IGZyb20gbW9kdWxlIGNoaWxkcmVuXG4gXHRcdHZhciBkZXBlbmRlbmN5O1xuIFx0XHR2YXIgbW9kdWxlT3V0ZGF0ZWREZXBlbmRlbmNpZXM7XG4gXHRcdGZvciAobW9kdWxlSWQgaW4gb3V0ZGF0ZWREZXBlbmRlbmNpZXMpIHtcbiBcdFx0XHRpZiAoXG4gXHRcdFx0XHRPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob3V0ZGF0ZWREZXBlbmRlbmNpZXMsIG1vZHVsZUlkKVxuIFx0XHRcdCkge1xuIFx0XHRcdFx0bW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF07XG4gXHRcdFx0XHRpZiAobW9kdWxlKSB7XG4gXHRcdFx0XHRcdG1vZHVsZU91dGRhdGVkRGVwZW5kZW5jaWVzID0gb3V0ZGF0ZWREZXBlbmRlbmNpZXNbbW9kdWxlSWRdO1xuIFx0XHRcdFx0XHRmb3IgKGogPSAwOyBqIDwgbW9kdWxlT3V0ZGF0ZWREZXBlbmRlbmNpZXMubGVuZ3RoOyBqKyspIHtcbiBcdFx0XHRcdFx0XHRkZXBlbmRlbmN5ID0gbW9kdWxlT3V0ZGF0ZWREZXBlbmRlbmNpZXNbal07XG4gXHRcdFx0XHRcdFx0aWR4ID0gbW9kdWxlLmNoaWxkcmVuLmluZGV4T2YoZGVwZW5kZW5jeSk7XG4gXHRcdFx0XHRcdFx0aWYgKGlkeCA+PSAwKSBtb2R1bGUuY2hpbGRyZW4uc3BsaWNlKGlkeCwgMSk7XG4gXHRcdFx0XHRcdH1cbiBcdFx0XHRcdH1cbiBcdFx0XHR9XG4gXHRcdH1cblxuIFx0XHQvLyBOb3QgaW4gXCJhcHBseVwiIHBoYXNlXG4gXHRcdGhvdFNldFN0YXR1cyhcImFwcGx5XCIpO1xuXG4gXHRcdGhvdEN1cnJlbnRIYXNoID0gaG90VXBkYXRlTmV3SGFzaDtcblxuIFx0XHQvLyBpbnNlcnQgbmV3IGNvZGVcbiBcdFx0Zm9yIChtb2R1bGVJZCBpbiBhcHBsaWVkVXBkYXRlKSB7XG4gXHRcdFx0aWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChhcHBsaWVkVXBkYXRlLCBtb2R1bGVJZCkpIHtcbiBcdFx0XHRcdG1vZHVsZXNbbW9kdWxlSWRdID0gYXBwbGllZFVwZGF0ZVttb2R1bGVJZF07XG4gXHRcdFx0fVxuIFx0XHR9XG5cbiBcdFx0Ly8gY2FsbCBhY2NlcHQgaGFuZGxlcnNcbiBcdFx0dmFyIGVycm9yID0gbnVsbDtcbiBcdFx0Zm9yIChtb2R1bGVJZCBpbiBvdXRkYXRlZERlcGVuZGVuY2llcykge1xuIFx0XHRcdGlmIChcbiBcdFx0XHRcdE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvdXRkYXRlZERlcGVuZGVuY2llcywgbW9kdWxlSWQpXG4gXHRcdFx0KSB7XG4gXHRcdFx0XHRtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXTtcbiBcdFx0XHRcdGlmIChtb2R1bGUpIHtcbiBcdFx0XHRcdFx0bW9kdWxlT3V0ZGF0ZWREZXBlbmRlbmNpZXMgPSBvdXRkYXRlZERlcGVuZGVuY2llc1ttb2R1bGVJZF07XG4gXHRcdFx0XHRcdHZhciBjYWxsYmFja3MgPSBbXTtcbiBcdFx0XHRcdFx0Zm9yIChpID0gMDsgaSA8IG1vZHVsZU91dGRhdGVkRGVwZW5kZW5jaWVzLmxlbmd0aDsgaSsrKSB7XG4gXHRcdFx0XHRcdFx0ZGVwZW5kZW5jeSA9IG1vZHVsZU91dGRhdGVkRGVwZW5kZW5jaWVzW2ldO1xuIFx0XHRcdFx0XHRcdGNiID0gbW9kdWxlLmhvdC5fYWNjZXB0ZWREZXBlbmRlbmNpZXNbZGVwZW5kZW5jeV07XG4gXHRcdFx0XHRcdFx0aWYgKGNiKSB7XG4gXHRcdFx0XHRcdFx0XHRpZiAoY2FsbGJhY2tzLmluZGV4T2YoY2IpICE9PSAtMSkgY29udGludWU7XG4gXHRcdFx0XHRcdFx0XHRjYWxsYmFja3MucHVzaChjYik7XG4gXHRcdFx0XHRcdFx0fVxuIFx0XHRcdFx0XHR9XG4gXHRcdFx0XHRcdGZvciAoaSA9IDA7IGkgPCBjYWxsYmFja3MubGVuZ3RoOyBpKyspIHtcbiBcdFx0XHRcdFx0XHRjYiA9IGNhbGxiYWNrc1tpXTtcbiBcdFx0XHRcdFx0XHR0cnkge1xuIFx0XHRcdFx0XHRcdFx0Y2IobW9kdWxlT3V0ZGF0ZWREZXBlbmRlbmNpZXMpO1xuIFx0XHRcdFx0XHRcdH0gY2F0Y2ggKGVycikge1xuIFx0XHRcdFx0XHRcdFx0aWYgKG9wdGlvbnMub25FcnJvcmVkKSB7XG4gXHRcdFx0XHRcdFx0XHRcdG9wdGlvbnMub25FcnJvcmVkKHtcbiBcdFx0XHRcdFx0XHRcdFx0XHR0eXBlOiBcImFjY2VwdC1lcnJvcmVkXCIsXG4gXHRcdFx0XHRcdFx0XHRcdFx0bW9kdWxlSWQ6IG1vZHVsZUlkLFxuIFx0XHRcdFx0XHRcdFx0XHRcdGRlcGVuZGVuY3lJZDogbW9kdWxlT3V0ZGF0ZWREZXBlbmRlbmNpZXNbaV0sXG4gXHRcdFx0XHRcdFx0XHRcdFx0ZXJyb3I6IGVyclxuIFx0XHRcdFx0XHRcdFx0XHR9KTtcbiBcdFx0XHRcdFx0XHRcdH1cbiBcdFx0XHRcdFx0XHRcdGlmICghb3B0aW9ucy5pZ25vcmVFcnJvcmVkKSB7XG4gXHRcdFx0XHRcdFx0XHRcdGlmICghZXJyb3IpIGVycm9yID0gZXJyO1xuIFx0XHRcdFx0XHRcdFx0fVxuIFx0XHRcdFx0XHRcdH1cbiBcdFx0XHRcdFx0fVxuIFx0XHRcdFx0fVxuIFx0XHRcdH1cbiBcdFx0fVxuXG4gXHRcdC8vIExvYWQgc2VsZiBhY2NlcHRlZCBtb2R1bGVzXG4gXHRcdGZvciAoaSA9IDA7IGkgPCBvdXRkYXRlZFNlbGZBY2NlcHRlZE1vZHVsZXMubGVuZ3RoOyBpKyspIHtcbiBcdFx0XHR2YXIgaXRlbSA9IG91dGRhdGVkU2VsZkFjY2VwdGVkTW9kdWxlc1tpXTtcbiBcdFx0XHRtb2R1bGVJZCA9IGl0ZW0ubW9kdWxlO1xuIFx0XHRcdGhvdEN1cnJlbnRQYXJlbnRzID0gW21vZHVsZUlkXTtcbiBcdFx0XHR0cnkge1xuIFx0XHRcdFx0X193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCk7XG4gXHRcdFx0fSBjYXRjaCAoZXJyKSB7XG4gXHRcdFx0XHRpZiAodHlwZW9mIGl0ZW0uZXJyb3JIYW5kbGVyID09PSBcImZ1bmN0aW9uXCIpIHtcbiBcdFx0XHRcdFx0dHJ5IHtcbiBcdFx0XHRcdFx0XHRpdGVtLmVycm9ySGFuZGxlcihlcnIpO1xuIFx0XHRcdFx0XHR9IGNhdGNoIChlcnIyKSB7XG4gXHRcdFx0XHRcdFx0aWYgKG9wdGlvbnMub25FcnJvcmVkKSB7XG4gXHRcdFx0XHRcdFx0XHRvcHRpb25zLm9uRXJyb3JlZCh7XG4gXHRcdFx0XHRcdFx0XHRcdHR5cGU6IFwic2VsZi1hY2NlcHQtZXJyb3ItaGFuZGxlci1lcnJvcmVkXCIsXG4gXHRcdFx0XHRcdFx0XHRcdG1vZHVsZUlkOiBtb2R1bGVJZCxcbiBcdFx0XHRcdFx0XHRcdFx0ZXJyb3I6IGVycjIsXG4gXHRcdFx0XHRcdFx0XHRcdG9yaWdpbmFsRXJyb3I6IGVyclxuIFx0XHRcdFx0XHRcdFx0fSk7XG4gXHRcdFx0XHRcdFx0fVxuIFx0XHRcdFx0XHRcdGlmICghb3B0aW9ucy5pZ25vcmVFcnJvcmVkKSB7XG4gXHRcdFx0XHRcdFx0XHRpZiAoIWVycm9yKSBlcnJvciA9IGVycjI7XG4gXHRcdFx0XHRcdFx0fVxuIFx0XHRcdFx0XHRcdGlmICghZXJyb3IpIGVycm9yID0gZXJyO1xuIFx0XHRcdFx0XHR9XG4gXHRcdFx0XHR9IGVsc2Uge1xuIFx0XHRcdFx0XHRpZiAob3B0aW9ucy5vbkVycm9yZWQpIHtcbiBcdFx0XHRcdFx0XHRvcHRpb25zLm9uRXJyb3JlZCh7XG4gXHRcdFx0XHRcdFx0XHR0eXBlOiBcInNlbGYtYWNjZXB0LWVycm9yZWRcIixcbiBcdFx0XHRcdFx0XHRcdG1vZHVsZUlkOiBtb2R1bGVJZCxcbiBcdFx0XHRcdFx0XHRcdGVycm9yOiBlcnJcbiBcdFx0XHRcdFx0XHR9KTtcbiBcdFx0XHRcdFx0fVxuIFx0XHRcdFx0XHRpZiAoIW9wdGlvbnMuaWdub3JlRXJyb3JlZCkge1xuIFx0XHRcdFx0XHRcdGlmICghZXJyb3IpIGVycm9yID0gZXJyO1xuIFx0XHRcdFx0XHR9XG4gXHRcdFx0XHR9XG4gXHRcdFx0fVxuIFx0XHR9XG5cbiBcdFx0Ly8gaGFuZGxlIGVycm9ycyBpbiBhY2NlcHQgaGFuZGxlcnMgYW5kIHNlbGYgYWNjZXB0ZWQgbW9kdWxlIGxvYWRcbiBcdFx0aWYgKGVycm9yKSB7XG4gXHRcdFx0aG90U2V0U3RhdHVzKFwiZmFpbFwiKTtcbiBcdFx0XHRyZXR1cm4gUHJvbWlzZS5yZWplY3QoZXJyb3IpO1xuIFx0XHR9XG5cbiBcdFx0aG90U2V0U3RhdHVzKFwiaWRsZVwiKTtcbiBcdFx0cmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUpIHtcbiBcdFx0XHRyZXNvbHZlKG91dGRhdGVkTW9kdWxlcyk7XG4gXHRcdH0pO1xuIFx0fVxuXG4gXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fSxcbiBcdFx0XHRob3Q6IGhvdENyZWF0ZU1vZHVsZShtb2R1bGVJZCksXG4gXHRcdFx0cGFyZW50czogKGhvdEN1cnJlbnRQYXJlbnRzVGVtcCA9IGhvdEN1cnJlbnRQYXJlbnRzLCBob3RDdXJyZW50UGFyZW50cyA9IFtdLCBob3RDdXJyZW50UGFyZW50c1RlbXApLFxuIFx0XHRcdGNoaWxkcmVuOiBbXVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBob3RDcmVhdGVSZXF1aXJlKG1vZHVsZUlkKSk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7XG4gXHRcdFx0XHRjb25maWd1cmFibGU6IGZhbHNlLFxuIFx0XHRcdFx0ZW51bWVyYWJsZTogdHJ1ZSxcbiBcdFx0XHRcdGdldDogZ2V0dGVyXG4gXHRcdFx0fSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uciA9IGZ1bmN0aW9uKGV4cG9ydHMpIHtcbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cbiBcdC8vIF9fd2VicGFja19oYXNoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18uaCA9IGZ1bmN0aW9uKCkgeyByZXR1cm4gaG90Q3VycmVudEhhc2g7IH07XG5cblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gaG90Q3JlYXRlUmVxdWlyZSgwKShfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSAwKTtcbiIsIi8vIGltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgUmVhY3QgZnJvbSAnLi9yZWFjdGluZyc7XG4vLyBpbXBvcnQgUmVhY3QgZnJvbSAnbHV5JztcblxuaW1wb3J0IEhvbWUgZnJvbSAnLi9jb250YWluZXIvSG9tZSc7XG5pbXBvcnQgSGVhZGVyIGZyb20gJy4vY29udGFpbmVyL0hlYWRlcic7XG5cbmNsYXNzIEFwcCBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG5cbiAgICByZW5kZXIoKSB7XG5cbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICAgICAgPGgzPldlbGNvbWUgdG8gQXBwIFBhZ2UuPC9oMz5cbiAgICAgICAgICAgICAgICA8SGVhZGVyLz5cbiAgICAgICAgICAgICAgICA8SG9tZS8+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgKTtcbiAgICB9XG5cbn1cblxuZXhwb3J0IGRlZmF1bHQgQXBwO1xuIiwiLy8gaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCBSZWFjdCBmcm9tICcuLi9yZWFjdGluZyc7XG4vLyBpbXBvcnQgUmVhY3QgZnJvbSAnbHV5JztcblxuY2xhc3MgUGxvdEJvYXJkIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcblxuICAgIC8vIGNvbnN0cnVjdG9yKCkge1xuICAgIC8vICAgICBzdXBlcigpO1xuICAgIC8vICAgICB0aGlzLnN0YXRlID0ge1xuICAgIC8vICAgICAgICAgaGVhZGVyTWVudTogWyfppbznirblm74nLCAn5oqY57q/5Zu+JywgJ+adoeW9ouWbvicsICflhbbku5blm74nXSxcbiAgICAvLyAgICAgfVxuICAgIC8vIH1cblxuICAgIHJlbmRlcigpIHtcblxuICAgICAgICBjb25zdCB7Ym9hcmREYXRhfSA9IHRoaXMucHJvcHM7XG4gICAgICAgIGNvbnN0IHN0eWxlQm9hcmQgPSB7XG4gICAgICAgICAgICB3aWR0aDogJzQ4MCcsXG4gICAgICAgICAgICBoZWlnaHQ6ICczMjAnLFxuICAgICAgICAgICAgYmFja2dyb3VuZENvbG9yOiAnI2VlZScsXG4gICAgICAgICAgICBmbG9hdDogJ2xlZnQnLFxuICAgICAgICAgICAgdGV4dEFsaWduOiAnY2VudGVyJyxcbiAgICAgICAgICAgIG1hcmdpbjogJzYgMjQnLFxuICAgICAgICB9O1xuXG4gICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgICAgIHtib2FyZERhdGEubWFwKGZ1bmN0aW9uIChpdGVtLCBpKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiA8ZGl2IGtleT17aX0gc3R5bGU9e3N0eWxlQm9hcmR9PlxuICAgICAgICAgICAgICAgICAgICAgICAgPGgyPntpdGVtfTwvaDI+XG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIH0pfVxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICk7XG4gICAgfVxuXG59XG5cblxuZXhwb3J0IGRlZmF1bHQgUGxvdEJvYXJkO1xuIiwiLy8gaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCBSZWFjdCBmcm9tICcuLi9yZWFjdGluZyc7XG4vLyBpbXBvcnQgUmVhY3QgZnJvbSAnbHV5JztcblxuY2xhc3MgSGVhZGVyIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcblxuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLnN0YXRlID0ge1xuICAgICAgICAgICAgaGVhZGVyTWVudTogWyfppbznirblm74nLCAn5oqY57q/5Zu+JywgJ+adoeW9ouWbvicsJ+aVo+eCueWbvicsICflhbbku5blm74nXSxcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJlbmRlcigpIHtcblxuICAgICAgICBjb25zdCB7aGVhZGVyTWVudX0gPSB0aGlzLnN0YXRlO1xuICAgICAgICBjb25zdCBzdHlsZUJ0biA9IHtcbiAgICAgICAgICAgIC8vIHdpZHRoOiAnNzJweCcsXG4gICAgICAgICAgICAvLyBoZWlnaHQ6ICczNnB4JyxcbiAgICAgICAgICAgIHBhZGRpbmc6ICcxMiAzNicsXG4gICAgICAgICAgICBtYXJnaW46ICc4IDI0JyxcbiAgICAgICAgICAgIGNvbG9yOiAnI2ZmZicsXG4gICAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6JyM3NzcnLFxuICAgICAgICAgICAgYm9yZGVyOidub25lJyxcbiAgICAgICAgICAgIGJvcmRlclJhZGl1czonNHB4JyxcbiAgICAgICAgICAgIGN1cnNvcjogJ3BvaW50ZXInLFxuICAgICAgICAgICAgZm9udFNpemU6JzEuMXJlbScsXG5cbiAgICB9XG4gICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgICAgIHtoZWFkZXJNZW51Lm1hcChmdW5jdGlvbiAoaXRlbSwgaSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gPGJ1dHRvbiBzdHlsZT17c3R5bGVCdG59IGtleT17aX0gdHlwZT1cImJ1dHRvblwiPntpdGVtfTwvYnV0dG9uPlxuICAgICAgICAgICAgICAgIH0pfVxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICk7XG4gICAgfVxuXG59XG5cblxuZXhwb3J0IGRlZmF1bHQgSGVhZGVyO1xuIiwiLy8gaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCBSZWFjdCBmcm9tICcuLi9yZWFjdGluZyc7XG4vLyBpbXBvcnQgUmVhY3QgZnJvbSAnbHV5JztcblxuaW1wb3J0IFBsb3RCb2FyZCBmcm9tICcuLi9jb21wb25lbnQvUGxvdEJvYXJkJztcblxuY2xhc3MgSG9tZSBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG5cbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy5zdGF0ZSA9IHtcbiAgICAgICAgICAgIGJvYXJkRGF0YTogWydhYScsICdiYicsICdjYycsICdkZCcsICdlZScsICdmZicsICdnZycsICdoaCcsICdpaWknLCAnamonXSxcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJlbmRlcigpIHtcblxuICAgICAgICBjb25zdCB7Ym9hcmREYXRhfSA9IHRoaXMuc3RhdGU7XG4gICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgICAgIDxQbG90Qm9hcmQgYm9hcmREYXRhPXtib2FyZERhdGF9Lz5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICApO1xuICAgIH1cblxufVxuXG5leHBvcnQgZGVmYXVsdCBIb21lO1xuIiwiLy8gaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0Jztcbi8vIGltcG9ydCBSZWFjdERPTSBmcm9tICdyZWFjdC1kb20nO1xuXG5pbXBvcnQgUmVhY3QgZnJvbSAnLi9yZWFjdGluZyc7XG5pbXBvcnQgUmVhY3RET00gZnJvbSAnLi9yZWFjdGluZyc7XG5cbmltcG9ydCBBcHAgZnJvbSAnLi9BcHAnO1xuXG5SZWFjdERPTS5yZW5kZXIoKFxuICAgIDxBcHAvPlxuKSwgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3Jvb3QnKSk7XG4iLCIvLyBleHBvcnQgZGVmYXVsdCAgUmVhY3QgZnJvbSAnLi4vc3JjJztcblxuLy8gaW1wb3J0IFJlYWN0IGZyb20gJy4uL2J1aWxkL3JlYWN0aW5nJztcbmltcG9ydCBSZWFjdCBmcm9tICcuLi9zcmMnO1xuXG5leHBvcnQgZGVmYXVsdCBSZWFjdDtcbiIsImltcG9ydCB7ZmxhdHRlbkNoaWxkcmVufSBmcm9tICcuL2NyZWF0ZUVsZW1lbnQnXG5pbXBvcnQge3R5cGVOdW1iZXJ9IGZyb20gJy4vdXRpbHMnXG5cbmNvbnN0IENoaWxkcmVuID0ge1xuICAgIC8vY29udGV4dOS4jeaYr+e7hOS7tueahGNvbnRleHTogIzmmK/nu4Tku7bkuIrkuIvmlodcbiAgICBtYXAoY2hpbGRWbm9kZSwgY2FsbGJhY2ssIGNvbnRleHQpIHtcbiAgICAgICAgaWYgKGNoaWxkVm5vZGUgPT09IG51bGwgfHwgY2hpbGRWbm9kZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICByZXR1cm4gW2NoaWxkVm5vZGVdXG4gICAgICAgIH1cbiAgICAgICAgaWYgKHR5cGVOdW1iZXIoY2hpbGRWbm9kZSkgIT09IDcpIHtcbiAgICAgICAgICAgIHJldHVybiBbY2FsbGJhY2suY2FsbChjb250ZXh0LCBjaGlsZFZub2RlLCAwKV1cbiAgICAgICAgfVxuXG4gICAgICAgIHZhciByZXQgPSBbXVxuICAgICAgICBmbGF0dGVuQ2hpbGRyZW4oY2hpbGRWbm9kZSkuZm9yRWFjaCgob2xkVm5vZGUsIGluZGV4KSA9PiB7XG4gICAgICAgICAgICBsZXQgbmV3Vm5vZGUgPSBjYWxsYmFjay5jYWxsKGNvbnRleHQsIG9sZFZub2RlLCBpbmRleClcbiAgICAgICAgICAgIGlmIChuZXdWbm9kZSA9PT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIHJldHVyblxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0LnB1c2gobmV3Vm5vZGUpXG4gICAgICAgIH0pXG4gICAgICAgIHJldHVybiByZXRcbiAgICB9LFxuXG4gICAgb25seShjaGlsZFZub2RlKSB7XG4gICAgICAgIGlmICh0eXBlTnVtYmVyKGNoaWxkVm5vZGUpICE9PSA3KSB7XG4gICAgICAgICAgICByZXR1cm4gY2hpbGRWbm9kZVxuICAgICAgICB9XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIlJlYWN0LkNoaWxkcmVuLm9ubHkgZXhwZWN0IG9ubHkgb25lIGNoaWxkLCB3aGljaCBtZWFucyB5b3UgY2Fubm90IHVzZSBhIGxpc3QgaW5zaWRlIGEgY29tcG9uZW50XCIpO1xuICAgIH0sXG5cbiAgICBjb3VudChjaGlsZFZub2RlKSB7XG4gICAgICAgIGlmIChjaGlsZFZub2RlID09PSBudWxsKSB7XG4gICAgICAgICAgICByZXR1cm4gMFxuICAgICAgICB9XG4gICAgICAgIGlmICh0eXBlTnVtYmVyKGNoaWxkVm5vZGUpICE9PSA3KSB7XG4gICAgICAgICAgICByZXR1cm4gMVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmbGF0dGVuQ2hpbGRyZW4oY2hpbGRWbm9kZSkubGVuZ3RoXG4gICAgfSxcblxuICAgIGZvckVhY2goY2hpbGRWbm9kZSwgY2FsbGJhY2ssIGNvbnRleHQpIHtcbiAgICAgICAgbGV0IGZsYXR0ZW4gPSBmbGF0dGVuQ2hpbGRyZW4oY2hpbGRWbm9kZSlcblxuICAgICAgICBpZiAodHlwZU51bWJlcihmbGF0dGVuKSA9PT0gNykge1xuICAgICAgICAgICAgZmxhdHRlbkNoaWxkcmVuKGNoaWxkVm5vZGUpLmZvckVhY2goY2FsbGJhY2ssIGNvbnRleHQpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY2FsbGJhY2suY2FsbChjb250ZXh0LCBjaGlsZFZub2RlLCAwKVxuICAgICAgICB9XG4gICAgfSxcblxuICAgIHRvQXJyYXk6IGZ1bmN0aW9uIChjaGlsZFZub2RlKSB7XG4gICAgICAgIGlmIChjaGlsZFZub2RlID09IG51bGwpIHtcbiAgICAgICAgICAgIHJldHVybiBbXTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gQ2hpbGRyZW4ubWFwKGNoaWxkVm5vZGUsIGZ1bmN0aW9uIChlbCkge1xuICAgICAgICAgICAgcmV0dXJuIGVsO1xuICAgICAgICB9KTtcbiAgICB9XG5cbn1cblxuZXhwb3J0IHtcbiAgICBDaGlsZHJlbixcbn07XG4iLCJpbXBvcnQgeyBjcmVhdGVFbGVtZW50IH0gZnJvbSBcIi4vY3JlYXRlRWxlbWVudFwiXG5cbiBmdW5jdGlvbiBjbG9uZUVsZW1lbnQodm5vZGUsIHByb3BzKSB7XG5cbiAgICBsZXQgY29uZmlnPXt9LCBjaGlsZHJlbjtcblxuICAgIGZvciAobGV0IHByb3BOYW1lIGluIHZub2RlLnByb3BzKSB7XG4gICAgICAgIGlmIChwcm9wTmFtZSA9PT0gJ2NoaWxkcmVuJykge1xuICAgICAgICAgICAgY2hpbGRyZW4gPSB2bm9kZS5wcm9wc1twcm9wTmFtZV1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvbmZpZ1twcm9wTmFtZV0gPSB2bm9kZS5wcm9wc1twcm9wTmFtZV1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIGNvbmZpZyA9IHsgLi4uY29uZmlnLCAuLi5wcm9wcyB9O1xuXG4gICAgbGV0IG5ld0tleSA9IHByb3BzLmtleSA/IHByb3BzLmtleSA6IHZub2RlLmtleTtcbiAgICBsZXQgbmV3UmVmID0gcHJvcHMucmVmID8gcHJvcHMucmVmIDogdm5vZGUucmVmO1xuICAgIGNvbmZpZ1sna2V5J10gPSBuZXdLZXk7XG4gICAgY29uZmlnWydyZWYnXSA9IG5ld1JlZjtcblxuICAgIHJldHVybiBjcmVhdGVFbGVtZW50KHZub2RlLnR5cGUsIGNvbmZpZywgY2hpbGRyZW4pO1xufVxuXG5leHBvcnQge1xuICAgIGNsb25lRWxlbWVudCxcbn07XG4iLCJpbXBvcnQgeyB1cGRhdGUsIGN1cnJlbnRPd25lciB9IGZyb20gJy4vdmRvbSdcbmltcG9ydCB7IG9wdGlvbnMsIGV4dGVuZCB9IGZyb20gJy4vdXRpbHMnXG5pbXBvcnQgeyBWbm9kZSB9IGZyb20gJy4vY3JlYXRlRWxlbWVudCdcbmltcG9ydCB7IGNhdGNoRXJyb3IgfSBmcm9tICcuL2Vycm9yQm91bmRhcnknO1xuXG5leHBvcnQgY29uc3QgQ29tID0ge1xuICBDUkVBVEU6IDAsLy/liJvpgKDoioLngrlcbiAgTU9VTlQ6IDEsLy/oioLngrnlt7Lnu4/mjILovb1cbiAgVVBEQVRJTkc6IDIsLy/oioLngrnmraPlnKjmm7TmlrBcbiAgVVBEQVRFRDogMywvL+iKgueCueW3sue7j+abtOaWsFxuICBNT1VOVFRJTkc6IDQsLy/oioLngrnmraPlnKjmjILovb0sXG4gIENBVENISU5HOiA1XG59XG5cbnZhciB1bmlxdWVJZCA9IDBcbi8vIOeUqOaIt+eUqOadpee7p+aJv+eahCBDb21wb25lbnQg57G7XG5jbGFzcyBSZWFjdENsYXNzIHtcblxuICBjb25zdHJ1Y3Rvcihwcm9wcywgY29udGV4dCkge1xuICAgIHRoaXMucHJvcHMgPSBwcm9wc1xuICAgIHRoaXMuY29udGV4dCA9IGNvbnRleHRcbiAgICB0aGlzLnN0YXRlID0gdGhpcy5zdGF0ZSB8fCB7fTtcblxuICAgIHRoaXMubmV4dFN0YXRlID0gbnVsbFxuICAgIHRoaXMuX3JlbmRlckNhbGxiYWNrcyA9IFtdXG4gICAgdGhpcy5saWZlQ3ljbGUgPSBDb20uQ1JFQVRFXG4gICAgdGhpcy5zdGF0ZU1lcmdlUXVldWUgPSBbXVxuICAgIHRoaXMuX3BlbmRkaW5nU3RhdGUgPSBbXVxuICAgIHRoaXMucmVmcyA9IHt9XG4gICAgdGhpcy5fdW5pcXVlSWQgPSB1bmlxdWVJZFxuICAgIHVuaXF1ZUlkKytcbiAgfVxuXG4gIHVwZGF0ZUNvbXBvbmVudCgpIHtcblxuICAgIGNvbnN0IHByZXZTdGF0ZSA9IHRoaXMuc3RhdGVcbiAgICBjb25zdCBvbGRWbm9kZSA9IHRoaXMuVm5vZGVcbiAgICBjb25zdCBvbGRDb250ZXh0ID0gdGhpcy5jb250ZXh0XG5cbiAgICB0aGlzLm5leHRTdGF0ZSA9IHRoaXMuc3RhdGVcbiAgICBmb3IgKGxldCBpbmRleCBpbiB0aGlzLl9wZW5kZGluZ1N0YXRlKSB7XG4gICAgICBjb25zdCBpdGVtID0gdGhpcy5fcGVuZGRpbmdTdGF0ZVtpbmRleF07XG4gICAgICBpZiAodHlwZW9mIGl0ZW0ucGFydGlhbE5ld1N0YXRlID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIHRoaXMubmV4dFN0YXRlID0gT2JqZWN0LmFzc2lnbih7fSwgdGhpcy5uZXh0U3RhdGUsIGl0ZW0ucGFydGlhbE5ld1N0YXRlKHRoaXMubmV4dFN0YXRlLCB0aGlzLnByb3BzKSlcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMubmV4dFN0YXRlID0gT2JqZWN0LmFzc2lnbih7fSwgdGhpcy5zdGF0ZSwgaXRlbS5wYXJ0aWFsTmV3U3RhdGUpXG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHRoaXMubmV4dFN0YXRlICE9PSBwcmV2U3RhdGUpIHtcbiAgICAgIHRoaXMuc3RhdGUgPSB0aGlzLm5leHRTdGF0ZTtcbiAgICB9XG4gICAgaWYgKHRoaXMuZ2V0Q2hpbGRDb250ZXh0KSB7XG4gICAgICB0aGlzLmNvbnRleHQgPSBleHRlbmQoZXh0ZW5kKHt9LCB0aGlzLmNvbnRleHQpLCB0aGlzLmdldENoaWxkQ29udGV4dCgpKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5jb21wb25lbnRXaWxsVXBkYXRlKSB7XG4gICAgICBjYXRjaEVycm9yKHRoaXMsICdjb21wb25lbnRXaWxsVXBkYXRlJywgW3RoaXMucHJvcHMsIHRoaXMubmV4dFN0YXRlLCB0aGlzLmNvbnRleHRdKTtcbiAgICB9XG5cbiAgICB2YXIgbGFzdE93bmVyID0gY3VycmVudE93bmVyLmN1cjtcbiAgICBjdXJyZW50T3duZXIuY3VyID0gdGhpcztcbiAgICB0aGlzLm5leHRTdGF0ZSA9IG51bGxcbiAgICBsZXQgbmV3Vm5vZGUgPSB0aGlzLnJlbmRlcigpXG5cbiAgICBuZXdWbm9kZSA9IG5ld1Zub2RlID8gbmV3Vm5vZGUgOiBuZXcgVm5vZGUoJyN0ZXh0JywgXCJcIiwgbnVsbCwgbnVsbCk7XG4gICAgY3VycmVudE93bmVyLmN1ciA9IGxhc3RPd25lcjtcbiAgICB0aGlzLlZub2RlID0gdXBkYXRlKG9sZFZub2RlLCBuZXdWbm9kZSwgdGhpcy5Wbm9kZS5faG9zdE5vZGUsIHRoaXMuY29udGV4dCkvL+i/meS4quWHveaVsOi/lOWbnuS4gOS4quabtOaWsOWQjueahFZub2RlXG5cbiAgICBpZiAodGhpcy5jb21wb25lbnREaWRVcGRhdGUpIHtcbiAgICAgIGNhdGNoRXJyb3IodGhpcywgJ2NvbXBvbmVudERpZFVwZGF0ZScsIFt0aGlzLnByb3BzLCBwcmV2U3RhdGUsIG9sZENvbnRleHRdKTtcbiAgICB9XG5cbiAgICB0aGlzLl9wZW5kZGluZ1N0YXRlLmZvckVhY2goKGl0ZW0pID0+IHtcbiAgICAgIGlmICh0eXBlb2YgaXRlbS5jYWxsYmFjayA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICBpdGVtLmNhbGxiYWNrKHRoaXMuc3RhdGUsIHRoaXMucHJvcHMpXG4gICAgICB9XG4gICAgfSlcblxuICAgIHRoaXMuX3BlbmRkaW5nU3RhdGUgPSBbXVxuICB9XG5cbiAgX3VwZGF0ZUluTGlmZUN5Y2xlKCkge1xuICAgIGlmICh0aGlzLnN0YXRlTWVyZ2VRdWV1ZS5sZW5ndGggPiAwKSB7XG4gICAgICBsZXQgdGVtcFN0YXRlID0gdGhpcy5zdGF0ZTtcblxuICAgICAgdGhpcy5fcGVuZGRpbmdTdGF0ZS5mb3JFYWNoKChpdGVtKSA9PiB7XG4gICAgICAgIHRlbXBTdGF0ZSA9IE9iamVjdC5hc3NpZ24oe30sIHRlbXBTdGF0ZSwgLi4uaXRlbS5wYXJ0aWFsTmV3U3RhdGUpXG4gICAgICB9KTtcblxuICAgICAgdGhpcy5uZXh0U3RhdGUgPSB7IC4uLnRlbXBTdGF0ZSB9O1xuICAgICAgdGhpcy5zdGF0ZU1lcmdlUXVldWUgPSBbXTtcbiAgICAgIHRoaXMudXBkYXRlQ29tcG9uZW50KCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIOS6i+S7tuinpuWPkeeahOaXtuWAmXNldFN0YXRl5Y+q5Lya6Kem5Y+R5pyA5ZCO5LiA5LiqXG4gICAqIOWcqGNvbXBvbmVudGRpZG1vdW5055qE5pe25YCZ5Lya5YWo6YOo5ZCI5oiQXG4gICAqIEBwYXJhbSB7Kn0gcGFydGlhbE5ld1N0YXRlXG4gICAqIEBwYXJhbSB7Kn0gY2FsbGJhY2tcbiAgICovXG4gIHNldFN0YXRlKHBhcnRpYWxOZXdTdGF0ZSwgY2FsbGJhY2spIHtcblxuICAgIHRoaXMuX3BlbmRkaW5nU3RhdGUucHVzaCh7IHBhcnRpYWxOZXdTdGF0ZSwgY2FsbGJhY2sgfSlcblxuICAgIGlmICh0aGlzLnNob3VsZENvbXBvbmVudFVwZGF0ZSkge1xuICAgICAgbGV0IHNob3VsZFVwZGF0ZSA9IHRoaXMuc2hvdWxkQ29tcG9uZW50VXBkYXRlKHRoaXMucHJvcHMsIHRoaXMubmV4dFN0YXRlLCB0aGlzLmNvbnRleHQpXG4gICAgICBpZiAoIXNob3VsZFVwZGF0ZSkge1xuICAgICAgICByZXR1cm5cbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAodGhpcy5saWZlQ3ljbGUgPT09IENvbS5DUkVBVEUpIHtcbiAgICAgIC8v57uE5Lu25oyC6L295pyfXG5cbiAgICB9IGVsc2Uge1xuICAgICAgLy/nu4Tku7bmm7TmlrDmnJ9cbiAgICAgIGlmICh0aGlzLmxpZmVDeWNsZSA9PT0gQ29tLlVQREFUSU5HKSB7XG4gICAgICAgIHJldHVyblxuICAgICAgfVxuXG4gICAgICBpZiAodGhpcy5saWZlQ3ljbGUgPT09IENvbS5NT1VOVFRJTkcpIHtcbiAgICAgICAgLy9jb21wb25lbnREaWRNb3VudOeahOaXtuWAmeiwg+eUqHNldFN0YXRlXG4gICAgICAgIHRoaXMuc3RhdGVNZXJnZVF1ZXVlLnB1c2goMSlcbiAgICAgICAgcmV0dXJuXG4gICAgICB9XG5cbiAgICAgIGlmICh0aGlzLmxpZmVDeWNsZSA9PT0gQ29tLkNBVENISU5HKSB7XG4gICAgICAgIC8vY29tcG9uZW50RGlkTW91bnTnmoTml7blgJnosIPnlKhzZXRTdGF0ZVxuICAgICAgICB0aGlzLnN0YXRlTWVyZ2VRdWV1ZS5wdXNoKDEpXG4gICAgICAgIHJldHVyblxuICAgICAgfVxuXG5cbiAgICAgIGlmIChvcHRpb25zLmFzeW5jID09PSB0cnVlKSB7XG4gICAgICAgIC8v5LqL5Lu25Lit6LCD55SoXG4gICAgICAgIGxldCBkaXJ0eSA9IG9wdGlvbnMuZGlydHlDb21wb25lbnRbdGhpcy5fdW5pcXVlSWRdXG4gICAgICAgIGlmICghZGlydHkpIHtcbiAgICAgICAgICBvcHRpb25zLmRpcnR5Q29tcG9uZW50W3RoaXMuX3VuaXF1ZUlkXSA9IHRoaXNcbiAgICAgICAgfVxuICAgICAgICByZXR1cm5cbiAgICAgIH1cblxuICAgICAgLy/kuI3lnKjnlJ/lkb3lkajmnJ/kuK3osIPnlKjvvIzmnInlj6/og73mmK/lvILmraXosIPnlKhcbiAgICAgIHRoaXMudXBkYXRlQ29tcG9uZW50KClcbiAgICB9XG4gIH1cblxuICAvLyBzaG91bGRDb21wb25lbnRVcGRhdGUoKSB7IH1cbiAgY29tcG9uZW50V2lsbFJlY2VpdmVQcm9wcygpIHsgfVxuICAvLyBjb21wb25lbnRXaWxsVXBkYXRlKCkgeyB9XG4gIC8vIGNvbXBvbmVudERpZFVwZGF0ZSgpIHsgfVxuICBjb21wb25lbnRXaWxsTW91bnQoKSB7IH1cbiAgY29tcG9uZW50RGlkTW91bnQoKSB7IH1cbiAgY29tcG9uZW50V2lsbFVubW91bnQoKSB7IH1cbiAgY29tcG9uZW50RGlkVW5tb3VudCgpIHsgfVxuXG5cbiAgcmVuZGVyKCkgeyB9XG59XG5cbmV4cG9ydCB7XG4gIFJlYWN0Q2xhc3MsXG59XG5cbiIsInZhciBjb250cm9sbFByb3BzID0ge1xuICAgIGNvbG9yOiAxLFxuICAgIGRhdGU6IDEsXG4gICAgZGF0ZXRpbWU6IDEsXG4gICAgXCJkYXRldGltZS1sb2NhbFwiOiAxLFxuICAgIGVtYWlsOiAxLFxuICAgIG1vbnRoOiAxLFxuICAgIG51bWJlcjogMSxcbiAgICBwYXNzd29yZDogMSxcbiAgICByYW5nZTogMSxcbiAgICBzZWFyY2g6IDEsXG4gICAgdGVsOiAxLFxuICAgIHRleHQ6IDEsXG4gICAgdGltZTogMSxcbiAgICB1cmw6IDEsXG4gICAgd2VlazogMSxcbiAgICB0ZXh0YXJlYTogMSxcbiAgICBjaGVja2JveDogMixcbiAgICByYWRpbzogMixcbiAgICBcInNlbGVjdC1vbmVcIjogMyxcbiAgICBcInNlbGVjdC1tdWx0aXBsZVwiOiAzXG59O1xuXG52YXIgY29udHJvbGxEYXRhID0ge1xuICAgIDE6IFtcbiAgICAgICAgXCJ2YWx1ZVwiLFxuICAgICAgICB7XG4gICAgICAgICAgICBvbkNoYW5nZTogMSxcbiAgICAgICAgICAgIG9uSW5wdXQ6IDEsXG4gICAgICAgICAgICByZWFkT25seTogMSxcbiAgICAgICAgICAgIGRpc2FibGVkOiAxXG4gICAgICAgIH0sXG4gICAgICAgIFwib25pbnB1dFwiLFxuICAgICAgICBwcmV2ZW50VXNlcklucHV0XG4gICAgXSxcbiAgICAyOiBbXG4gICAgICAgIFwiY2hlY2tlZFwiLFxuICAgICAgICB7XG4gICAgICAgICAgICBvbkNoYW5nZTogMSxcbiAgICAgICAgICAgIG9uQ2xpY2s6IDEsXG4gICAgICAgICAgICByZWFkT25seTogMSxcbiAgICAgICAgICAgIGRpc2FibGVkOiAxXG4gICAgICAgIH0sXG4gICAgICAgIFwib25jbGlja1wiLFxuICAgICAgICBwcmV2ZW50VXNlckNsaWNrXG4gICAgXSxcbiAgICAzOiBbXG4gICAgICAgIFwidmFsdWVcIixcbiAgICAgICAge1xuICAgICAgICAgICAgb25DaGFuZ2U6IDEsXG4gICAgICAgICAgICBkaXNhYmxlZDogMVxuICAgICAgICB9LFxuICAgICAgICBcIm9uY2hhbmdlXCIsXG4gICAgICAgIHByZXZlbnRVc2VyQ2hhbmdlXG4gICAgXVxufVxuXG5cbiBjb25zdCBtYXBDb250cm9sbGVkRWxlbWVudCA9IGZ1bmN0aW9uIChkb21Ob2RlLCBwcm9wcykge1xuICAgIGNvbnN0IHR5cGUgPSBkb21Ob2RlLnR5cGVcbiAgICBjb25zdCBjb250cm9sbFR5cGUgPSBjb250cm9sbFByb3BzW3R5cGVdXG4gICAgaWYgKGNvbnRyb2xsVHlwZSkge1xuICAgICAgICBjb25zdCBkYXRhID0gY29udHJvbGxEYXRhW2NvbnRyb2xsVHlwZV0vLzEuaW5wdXQgMi7luKbmnIljaGVja+eahGlucHV0IDMuc2VsZWN0XG4gICAgICAgIGNvbnN0IGNvbnRyb2xsUHJvcCA9IGRhdGFbMF0vL3ZhbHVlIC0tLSBpbnB1dCxjaGVjay0tLWlucHV0LHZhbHVlLS0tc2VsZWN0XG4gICAgICAgIGNvbnN0IG90aGVyUHJvcHMgPSBkYXRhWzFdLy/lpoLmnpzlhYPntKDlrprkuYnkuobov5nkupvlsZ7mgKfvvIzpgqPkuYjlsLHmmK/lj5fmjqflsZ7mgKfvvIzlkKbliJnpnZ7lj5fmjqdcbiAgICAgICAgY29uc3QgZXZlbnQgPSBkYXRhWzJdLy/mr4/kuIDnp43lhYPntKDlr7nlupTnmoTpmLLmraLnlKjmiLfovpPlhaXnmoTmlrnms5VcblxuICAgICAgICBpZiAoY29udHJvbGxQcm9wIGluIHByb3BzICYmICFoYXNPdGhlckNvbnRyb2xsUHJvcGVydHkocHJvcHMsIG90aGVyUHJvcHMpKSB7XG4gICAgICAgICAgICBjb25zb2xlLndhcm4oYOS9oOS4uiR7ZG9tTm9kZS5ub2RlTmFtZX1bdHlwZT0ke3R5cGV9XeWFg+e0oOaMh+WumuS6hiR7Y29udHJvbGxQcm9wfeWxnuaAp++8jFxuICAgICAgICAgICAg5L2G5piv5rKh5pyJ5o+Q5L6b5Y+m5aSW55qEJHtPYmplY3Qua2V5cyhvdGhlclByb3BzKX3mnaXmjqfliLYke2NvbnRyb2xsUHJvcH3lsZ7mgKfnmoTlj5jljJZcbiAgICAgICAgICAgIOmCo+S5iOWug+WNs+S4uuS4gOS4qumdnuWPl+aOp+e7hOS7tu+8jOeUqOaIt+aXoOazlemAmui/h+i+k+WFpeaUueWPmOWFg+e0oOeahCR7Y29udHJvbGxQcm9wfeWAvGApO1xuXG4gICAgICAgICAgICBkb21Ob2RlLl9sYXN0VmFsdWUgPSBwcm9wc1tjb250cm9sbFByb3BdXG4gICAgICAgICAgICBkb21Ob2RlW2V2ZW50XSA9IGRhdGFbM11cbiAgICAgICAgfSBlbHNlIHtcblxuICAgICAgICB9XG5cbiAgICB9XG59XG5cbmZ1bmN0aW9uIGhhc090aGVyQ29udHJvbGxQcm9wZXJ0eShwcm9wcywgb3RoZXJQcm9wcykge1xuICAgIGZvciAodmFyIGtleSBpbiBwcm9wcykge1xuICAgICAgICBpZiAob3RoZXJQcm9wc1trZXldKSB7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuZnVuY3Rpb24gcHJldmVudFVzZXJJbnB1dChlKSB7XG4gICAgdmFyIHRhcmdldCA9IGUudGFyZ2V0XG4gICAgdmFyIG5hbWUgPSBlLnR5cGUgPT09ICd0ZXh0YXJlYScgPyAnaW5uZXJIVE1MJyA6ICd2YWx1ZScgLy/lpoLmnpzmmK90ZXh0YXJlYe+8jOS7lueahOi+k+WFpeS/neWtmOWcqGlubmVySFRNTOmHjFxuICAgIHRhcmdldFtuYW1lXSA9IHRhcmdldC5fbGFzdFZhbHVlXG59XG5cbmZ1bmN0aW9uIHByZXZlbnRVc2VyQ2hhbmdlKGUpIHtcbiAgICBjb25zdCB0YXJnZXQgPSBlLnRhcmdldCxcbiAgICAgICAgdmFsdWUgPSB0YXJnZXQuX2xhc3RWYWx1ZSxcbiAgICAgICAgb3B0aW9ucyA9IHRhcmdldC5vcHRpb25zO1xuICAgIGlmICh0YXJnZXQubXVsdGlwbGUpIHtcblxuICAgIH0gZWxzZSB7XG4gICAgICAgIHVwZGF0ZU9wdGlvbnNPbmUob3B0aW9ucywgb3B0aW9ucy5sZW5ndGgsIHZhbHVlKVxuICAgIH1cblxufVxuZnVuY3Rpb24gcHJldmVudFVzZXJDbGljayhlKSB7XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpXG59XG5cbmZ1bmN0aW9uIHVwZGF0ZU9wdGlvbnNPbmUob3B0aW9ucywgbGVuZ3RoLCBsYXN0VmFsdWUpIHtcbiAgICBjb25zdCBzdHJpbmdWYWx1ZXMgPSB7fVxuICAgIGNvbnNvbGUubG9nKG9wdGlvbnMpXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgICBsZXQgb3B0aW9uID0gb3B0aW9uc1tpXVxuICAgICAgICBsZXQgdmFsdWUgPSBvcHRpb24udmFsdWVcbiAgICAgICAgaWYgKHZhbHVlID09PSBsYXN0VmFsdWUpIHtcbiAgICAgICAgICAgIG9wdGlvbi5zZWxlY3RlZCA9IHRydWVcbiAgICAgICAgICAgIHJldHVyblxuICAgICAgICB9XG4gICAgfVxuICAgIGlmIChsZW5ndGgpIHtcbiAgICAgICAgLy/pgInkuK3nrKzkuIDkuKpcbiAgICAgICAgb3B0aW9uc1swXS5zZWxlY3RlZCA9IHRydWVcbiAgICB9XG59XG5cbmZ1bmN0aW9uIHVwZGF0ZU9wdGlvbnNNb3JlKG9wdGlvbnMsIGxlbmd0aCwgbGFzdFZhbHVlKSB7XG4gICAgdmFyIHNlbGVjdGVkVmFsdWUgPSB7fVxuICAgIHRyeSB7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGFzdFZhbHVlLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBzZWxlY3RlZFZhbHVlW1wiJlwiICsgbGFzdFZhbHVlW2ldXSA9IHRydWVcbiAgICAgICAgfVxuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cbiAgICAgICAgY29uc29sZS53YXJuKCc8c2VsZWN0IG11bHRpcGxlPVwidHJ1ZVwiPiDnmoR2YWx1ZeW6lOivpeWvueW6lOS4gOS4quWtl+espuS4suaVsOe7hCcpXG4gICAgfVxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbjsgaSsrKSB7XG4gICAgICAgIGxldCBvcHRpb24gPSBvcHRpb25zW2ldXG4gICAgICAgIGxldCB2YWx1ZSA9IG9wdGlvbi52YWx1ZVxuICAgICAgICBsZXQgc2VsZWN0ZWQgPSBzZWxlY3RlZFZhbHVlLmhhc093blByb3BlcnR5KFwiJlwiICsgdmFsdWUpXG4gICAgICAgIG9wdGlvbi5zZWxlY3RlZCA9IHNlbGVjdGVkXG4gICAgfVxufVxuXG5leHBvcnQge1xuICAgIG1hcENvbnRyb2xsZWRFbGVtZW50LFxufTtcbiIsImltcG9ydCB7IHR5cGVOdW1iZXIgfSBmcm9tIFwiLi91dGlsc1wiO1xuaW1wb3J0IHsgY3VycmVudE93bmVyIH0gZnJvbSAnLi92ZG9tJ1xuXG5cbmNvbnN0IFJFU0VSVkVEX1BST1BTID0ge1xuICAgIHJlZjogdHJ1ZSxcbiAgICBrZXk6IHRydWUsXG4gICAgX19zZWxmOiB0cnVlLFxuICAgIF9fc291cmNlOiB0cnVlLFxufVxuXG5cbmZ1bmN0aW9uIFZub2RlKHR5cGUsIHByb3BzLCBrZXksIHJlZikge1xuICAgIHRoaXMub3duZXIgPSBjdXJyZW50T3duZXIuY3VyXG4gICAgdGhpcy50eXBlID0gdHlwZVxuICAgIHRoaXMucHJvcHMgPSBwcm9wc1xuICAgIHRoaXMua2V5ID0ga2V5XG4gICAgdGhpcy5yZWYgPSByZWZcbn1cblxuLyoqXG4gKiDliJvlu7romZrmi59Eb23nmoTlnLDmlrlcbiAqIEBwYXJhbSB7c3RyaW5nIHwgRnVuY3Rpb259IHR5cGVcbiAqIEBwYXJhbSB7b2JqZWN0fSBjb25maWdcbiAqIEBwYXJhbSB7YXJyYXl9IGNoaWxkcmVuXG4gKi9cbmZ1bmN0aW9uIGNyZWF0ZUVsZW1lbnQodHlwZTogc3RyaW5nIHwgRnVuY3Rpb24sIGNvbmZpZywgLi4uY2hpbGRyZW46IGFycmF5KSB7XG4gICAgbGV0IHByb3BzID0ge30sXG4gICAgICAgIGtleSA9IG51bGwsXG4gICAgICAgIHJlZiA9IG51bGwsXG4gICAgICAgIGNoaWxkTGVuZ3RoID0gY2hpbGRyZW4ubGVuZ3RoO1xuXG5cbiAgICBpZiAoY29uZmlnICE9IG51bGwpIHtcbiAgICAgICAgLy/lt6flppnnmoTlsIZrZXnovazljJbkuLrlrZfnrKbkuLJcbiAgICAgICAga2V5ID0gY29uZmlnLmtleSA9PT0gdW5kZWZpbmVkID8gbnVsbCA6ICcnICsgY29uZmlnLmtleVxuICAgICAgICByZWYgPSBjb25maWcucmVmID09PSB1bmRlZmluZWQgPyBudWxsIDogY29uZmlnLnJlZlxuXG4gICAgICAgIC8qKui/meS4gOatpeiusuWklumDqOeahHByb3DlsZ7mgKfmlL7ov5twcm9w6YeMICovXG4gICAgICAgIGZvciAobGV0IHByb3BOYW1lIGluIGNvbmZpZykge1xuICAgICAgICAgICAgLy8g6Zmk5Y675LiA5Lqb5LiN6ZyA6KaB55qE5bGe5oCnLGtleSxyZWbnrYlcbiAgICAgICAgICAgIGlmIChSRVNFUlZFRF9QUk9QUy5oYXNPd25Qcm9wZXJ0eShwcm9wTmFtZSkpIGNvbnRpbnVlXG4gICAgICAgICAgICAvL+S/neivgeaJgOacieeahOWxnuaAp+mDveS4jeaYr3VuZGVmaW5lZFxuICAgICAgICAgICAgaWYgKGNvbmZpZy5oYXNPd25Qcm9wZXJ0eShwcm9wTmFtZSkpIHtcbiAgICAgICAgICAgICAgICBwcm9wc1twcm9wTmFtZV0gPSBjb25maWdbcHJvcE5hbWVdXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoY2hpbGRMZW5ndGggPT09IDEpIHtcbiAgICAgICAgcHJvcHMuY2hpbGRyZW4gPSB0eXBlTnVtYmVyKGNoaWxkcmVuWzBdKSA+IDIgPyBjaGlsZHJlblswXSA6IFtdXG4gICAgfSBlbHNlIGlmIChjaGlsZExlbmd0aCA+IDEpIHtcbiAgICAgICAgcHJvcHMuY2hpbGRyZW4gPSBjaGlsZHJlblxuICAgIH1cblxuICAgIC8qKuiuvue9rmRlZmF1bHRQcm9wcyAqL1xuICAgIGxldCBkZWZhdWx0UHJvcHMgPSB0eXBlLmRlZmF1bHRQcm9wcztcbiAgICBpZiAoZGVmYXVsdFByb3BzKSB7XG4gICAgICAgIGZvciAobGV0IHByb3BOYW1lIGluIGRlZmF1bHRQcm9wcykge1xuICAgICAgICAgICAgaWYgKHByb3BzW3Byb3BOYW1lXSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgcHJvcHNbcHJvcE5hbWVdID0gZGVmYXVsdFByb3BzW3Byb3BOYW1lXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBuZXcgVm5vZGUodHlwZSwgcHJvcHMsIGtleSwgcmVmKTtcbn1cblxuLyoqXG4gKiDlrp7pmYXkuIrov5nph4zlgZrnmoTkuovmg4XlsLHmmK/lsIbmloflrZfoioLngrnlhajpg6jovazmjaLmiJBWbm9kZVxuICogQHBhcmFtIHsqfSBjaGlsZHJlblxuICovXG5leHBvcnQgZnVuY3Rpb24gZmxhdHRlbkNoaWxkcmVuKGNoaWxkcmVuOiBBcnJheSwgcGFyZW50Vm5vZGUpIHtcblxuICAgIGlmIChjaGlsZHJlbiA9PT0gdW5kZWZpbmVkKSByZXR1cm4gbmV3IFZub2RlKCcjdGV4dCcsIFwiXCIsIG51bGwsIG51bGwpXG5cbiAgICBsZXQgbGVuZ3RoID0gY2hpbGRyZW4ubGVuZ3RoXG4gICAgbGV0IGFyeSA9IFtdLFxuICAgICAgICBpc0xhc3RTaW1wbGUgPSBmYWxzZSwgLy/liKTmlq3kuIrkuIDkuKrlhYPntKDmmK/lkKbmmK9zdHJpbmcg5oiW6ICFIG51bWJlclxuICAgICAgICBsYXN0U3RyaW5nID0gJycsXG4gICAgICAgIGNoaWxkVHlwZSA9IHR5cGVOdW1iZXIoY2hpbGRyZW4pXG5cbiAgICBpZiAoY2hpbGRUeXBlID09PSA0IHx8IGNoaWxkVHlwZSA9PT0gMykge1xuICAgICAgICByZXR1cm4gbmV3IFZub2RlKCcjdGV4dCcsIGNoaWxkcmVuLCBudWxsLCBudWxsKVxuICAgIH1cblxuICAgIGlmIChjaGlsZFR5cGUgIT09IDcpIHtcbiAgICAgICAgaWYgKHBhcmVudFZub2RlKSBjaGlsZHJlbi5yZXR1cm4gPSBwYXJlbnRWbm9kZTtcbiAgICAgICAgcmV0dXJuIGNoaWxkcmVuXG4gICAgfVxuXG4gICAgY2hpbGRyZW4uZm9yRWFjaCgoaXRlbSwgaW5kZXgpID0+IHtcbiAgICAgICAgaWYgKHR5cGVOdW1iZXIoaXRlbSkgPT09IDcpIHtcbiAgICAgICAgICAgIGlmIChpc0xhc3RTaW1wbGUpIHtcbiAgICAgICAgICAgICAgICBhcnkucHVzaChsYXN0U3RyaW5nKVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaXRlbS5mb3JFYWNoKChpdGVtKSA9PiB7XG4gICAgICAgICAgICAgICAgYXJ5LnB1c2goaXRlbSlcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICBsYXN0U3RyaW5nID0gJydcbiAgICAgICAgICAgIGlzTGFzdFNpbXBsZSA9IGZhbHNlXG4gICAgICAgIH1cbiAgICAgICAgaWYgKHR5cGVOdW1iZXIoaXRlbSkgPT09IDMgfHwgdHlwZU51bWJlcihpdGVtKSA9PT0gNCkge1xuICAgICAgICAgICAgbGFzdFN0cmluZyArPSBpdGVtXG4gICAgICAgICAgICBpc0xhc3RTaW1wbGUgPSB0cnVlXG4gICAgICAgIH1cbiAgICAgICAgaWYgKHR5cGVOdW1iZXIoaXRlbSkgIT09IDMgJiYgdHlwZU51bWJlcihpdGVtKSAhPT0gNCAmJiB0eXBlTnVtYmVyKGl0ZW0pICE9PSA3KSB7XG4gICAgICAgICAgICBpZiAoaXNMYXN0U2ltcGxlKSB7Ly/kuIrkuIDkuKroioLngrnmmK/nroDljZXoioLngrlcbiAgICAgICAgICAgICAgICBhcnkucHVzaChsYXN0U3RyaW5nKVxuICAgICAgICAgICAgICAgIGFyeS5wdXNoKGl0ZW0pXG4gICAgICAgICAgICAgICAgbGFzdFN0cmluZyA9ICcnXG4gICAgICAgICAgICAgICAgaXNMYXN0U2ltcGxlID0gZmFsc2VcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgYXJ5LnB1c2goaXRlbSlcbiAgICAgICAgICAgIH1cblxuICAgICAgICB9XG4gICAgICAgIGlmIChsZW5ndGggLSAxID09PSBpbmRleCkge1xuICAgICAgICAgICAgaWYgKGxhc3RTdHJpbmcpIGFyeS5wdXNoKGxhc3RTdHJpbmcpXG4gICAgICAgIH1cbiAgICB9KVxuICAgIGFyeSA9IGFyeS5tYXAoKGl0ZW0pID0+IHtcbiAgICAgICAgaWYgKHR5cGVOdW1iZXIoaXRlbSkgPT09IDQpIHtcbiAgICAgICAgICAgIGl0ZW0gPSBuZXcgVm5vZGUoJyN0ZXh0JywgaXRlbSwgbnVsbCwgbnVsbClcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmIChpdGVtKSB7Ly/pppblhYjliKTmlq3mmK/lkKblrZjlnKhcbiAgICAgICAgICAgICAgICBpZiAodHlwZU51bWJlcihpdGVtKSAhPT0gMyAmJiB0eXBlTnVtYmVyKGl0ZW0pICE9PSA0KSB7Ly/lho3liKTmlq3mmK/kuI3mmK/lrZfnrKbkuLLvvIzmiJbogIXmlbDlrZdcbiAgICAgICAgICAgICAgICAgICAgLy/kuI3mmK/lsLHliqDkuIpyZXR1cm5cbiAgICAgICAgICAgICAgICAgICAgaWYgKHBhcmVudFZub2RlKSBpdGVtLnJldHVybiA9IHBhcmVudFZub2RlO1xuXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBpdGVtXG5cbiAgICB9KVxuXG4gICAgcmV0dXJuIGFyeVxufVxuXG5cbmV4cG9ydCB7XG4gICAgY3JlYXRlRWxlbWVudCxcbiAgICBWbm9kZSxcbn1cbiIsImltcG9ydCB7dHlwZU51bWJlcn0gZnJvbSAnLi91dGlscydcbmltcG9ydCB7Y2xlYXJSZWZzfSBmcm9tICcuL3JlZnMnXG5pbXBvcnQge2NhdGNoRXJyb3J9IGZyb20gJy4vZXJyb3JCb3VuZGFyeSc7XG5cbmZ1bmN0aW9uIGRpc3Bvc2VWbm9kZShWbm9kZSkgey8v5Li76KaB55So5LqO5Yig6ZmkVm5vZGXlr7nlupTnmoToioLngrlcbiAgICBjb25zdCB7dHlwZSwgcHJvcHN9ID0gVm5vZGVcbiAgICBpZiAodHlwZU51bWJlcihWbm9kZSkgPT09IDcpIHtcbiAgICAgICAgZGlzcG9zZUNoaWxkVm5vZGUoVm5vZGUpO1xuICAgICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKCF0eXBlKSByZXR1cm5cbiAgICAvLyBjbGVhckV2ZW50cyhWbm9kZS5faG9zdE5vZGUsIHByb3BzLCBWbm9kZSk7XG4gICAgaWYgKHR5cGVvZiBWbm9kZS50eXBlID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIGlmIChWbm9kZS5faW5zdGFuY2UuY29tcG9uZW50V2lsbFVubW91bnQpIHtcbiAgICAgICAgICAgIGNhdGNoRXJyb3IoVm5vZGUuX2luc3RhbmNlLCAnY29tcG9uZW50V2lsbFVubW91bnQnLCBbXSk7XG4gICAgICAgIH1cblxuICAgICAgICBjbGVhclJlZnMoVm5vZGUuX2luc3RhbmNlLnJlZilcbiAgICB9XG4gICAgaWYgKFZub2RlLnByb3BzLmNoaWxkcmVuKSB7XG4gICAgICAgIGRpc3Bvc2VDaGlsZFZub2RlKFZub2RlLnByb3BzLmNoaWxkcmVuKVxuICAgIH1cbiAgICBpZiAoVm5vZGUuX1BvcnRhbEhvc3ROb2RlKSB7XG4gICAgICAgIGNvbnN0IHBhcmVudCA9IFZub2RlLl9Qb3J0YWxIb3N0Tm9kZS5wYXJlbnROb2RlXG4gICAgICAgIHBhcmVudC5yZW1vdmVDaGlsZChWbm9kZS5fUG9ydGFsSG9zdE5vZGUpXG4gICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKFZub2RlLl9ob3N0Tm9kZSkgey8v5pyJ5Y+v6IO95Lya5Ye6546wdW5kZWZpbmTnmoTmg4XlhrVcbiAgICAgICAgICAgIGNvbnN0IHBhcmVudCA9IFZub2RlLl9ob3N0Tm9kZS5wYXJlbnROb2RlXG4gICAgICAgICAgICBpZiAocGFyZW50KVxuICAgICAgICAgICAgICAgIHBhcmVudC5yZW1vdmVDaGlsZChWbm9kZS5faG9zdE5vZGUpXG4gICAgICAgIH1cbiAgICB9XG4gICAgVm5vZGUuX2hvc3ROb2RlID0gbnVsbFxufVxuXG5mdW5jdGlvbiBkaXNwb3NlQ2hpbGRWbm9kZShjaGlsZFZub2RlKSB7XG4gICAgbGV0IGNoaWxkcmVuID0gY2hpbGRWbm9kZVxuICAgIGlmICh0eXBlTnVtYmVyKGNoaWxkcmVuKSAhPT0gNykgY2hpbGRyZW4gPSBbY2hpbGRyZW5dXG4gICAgY2hpbGRyZW4uZm9yRWFjaCgoY2hpbGQpID0+IHtcbiAgICAgICAgaWYgKHR5cGVvZiBjaGlsZC50eXBlID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICBpZiAodHlwZU51bWJlcihjaGlsZC5faG9zdE5vZGUpIDw9IDEpIHtcbiAgICAgICAgICAgICAgICBjaGlsZC5faG9zdE5vZGUgPSBudWxsO1xuICAgICAgICAgICAgICAgIGNoaWxkLl9pbnN0YW5jZSA9IG51bGw7XG4gICAgICAgICAgICAgICAgcmV0dXJuOy8v6K+B5piO6L+Z5Liq6IqC54K55bey57uP5YyX5Yig6ZmkXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChjaGlsZC5faW5zdGFuY2UuY29tcG9uZW50V2lsbFVubW91bnQpIHtcbiAgICAgICAgICAgICAgICBjYXRjaEVycm9yKGNoaWxkLl9pbnN0YW5jZSwgJ2NvbXBvbmVudFdpbGxVbm1vdW50JywgW10pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmICh0eXBlTnVtYmVyKGNoaWxkKSAhPT0gNCAmJiB0eXBlTnVtYmVyKGNoaWxkKSAhPT0gMyAmJiBjaGlsZC5faG9zdE5vZGUgIT09IHZvaWQgNjY2KSB7XG4gICAgICAgICAgICAvLyBjbGVhckV2ZW50cyhjaGlsZC5faG9zdE5vZGUsIGNoaWxkLnByb3BzLCBjaGlsZCk7XG4gICAgICAgICAgICBjb25zdCBwYXJlbnQgPSBjaGlsZC5faG9zdE5vZGUucGFyZW50Tm9kZVxuICAgICAgICAgICAgcGFyZW50LnJlbW92ZUNoaWxkKGNoaWxkLl9ob3N0Tm9kZSlcbiAgICAgICAgICAgIGNoaWxkLl9ob3N0Tm9kZSA9IG51bGxcbiAgICAgICAgICAgIGNoaWxkLl9pbnN0YW5jZSA9IG51bGxcbiAgICAgICAgICAgIGlmIChjaGlsZC5wcm9wcy5jaGlsZHJlbikge1xuICAgICAgICAgICAgICAgIGRpc3Bvc2VDaGlsZFZub2RlKGNoaWxkLnByb3BzLmNoaWxkcmVuKVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSlcbn1cblxuZXhwb3J0IHtcbiAgICBkaXNwb3NlVm5vZGUsXG59O1xuIiwiaW1wb3J0IHtkaXNwb3NlVm5vZGV9IGZyb20gJy4vZGlzcG9zZSc7XG5pbXBvcnQge3R5cGVOdW1iZXIsIG5vb3B9IGZyb20gJy4vdXRpbHMnO1xuaW1wb3J0IHtDb219IGZyb20gJy4vY29tcG9uZW50JztcblxudmFyIF9lcnJvclZub2RlID0gW107XG52YXIgVl9JbnN0YW5jZSA9IFtdO1xudmFyIGVycm9yTXNnID0gJyc7XG5leHBvcnQgdmFyIGdsb2JhbEVycm9yID0gdW5kZWZpbmVkO1xuXG4vKipcbiAqIOaNleaNiemUmeivr+eahOaguOW/g+S7o+egge+8jOmUmeivr+WPquS8muWPkeeUn+WcqOeUqOaIt+S6i+S7tuWbnuiwg++8jHJlZu+8jHNldFN0YXRl5Zue6LCD77yM55Sf5ZG95ZGo5pyf5Ye95pWwXG4gKiBAcGFyYW0geyp9IEluc3RhbmNlIOmcgOimgeaNleaNieeahOiZmuaLn+e7hOS7tuWunuS+i1xuICogQHBhcmFtIHsqfSBob29rbmFtZSDnlKjmiLfkuovku7blm57osIPvvIxyZWbvvIxzZXRTdGF0ZeWbnuiwg++8jOeUn+WRveWRqOacn+WHveaVsFxuICogQHBhcmFtIHsqfSBhcmdzIOWPguaVsFxuICovXG5mdW5jdGlvbiBjYXRjaEVycm9yKEluc3RhbmNlLCBob29rbmFtZSwgYXJncykge1xuICAgIHRyeSB7XG4gICAgICAgIGlmIChJbnN0YW5jZVtob29rbmFtZV0pIHtcbiAgICAgICAgICAgIHZhciByZXN1bHRlID0gdm9pZCA2NjY7XG4gICAgICAgICAgICBpZiAoaG9va25hbWUgPT09ICdyZW5kZXInKSB7XG4gICAgICAgICAgICAgICAgcmVzdWx0ZSA9IEluc3RhbmNlW2hvb2tuYW1lXS5hcHBseShJbnN0YW5jZSlcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmVzdWx0ZSA9IEluc3RhbmNlW2hvb2tuYW1lXS5hcHBseShJbnN0YW5jZSwgYXJncylcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiByZXN1bHRlXG4gICAgICAgIH1cbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIC8vIHRocm93IG5ldyBFcnJvcihlKTtcbiAgICAgICAgLy8gZGlzcG9zZVZub2RlKEluc3RhbmNlLlZub2RlKTtcbiAgICAgICAgbGV0IFZub2RlID0gdm9pZCA2NjY7XG4gICAgICAgIFZub2RlID0gSW5zdGFuY2UuVm5vZGU7XG4gICAgICAgIGlmIChob29rbmFtZSA9PT0gJ3JlbmRlcicgfHwgaG9va25hbWUgPT09ICdjb21wb25lbnRXaWxsTW91bnQnKSB7XG4gICAgICAgICAgICBWbm9kZSA9IGFyZ3NbMF07XG4gICAgICAgIH1cbiAgICAgICAgY29sbGVjdEVycm9yVm5vZGUoZSwgVm5vZGUsIGhvb2tuYW1lKTtcblxuICAgICAgICBpZiAoaG9va25hbWUgIT09ICdyZW5kZXInKSByZXR1cm4gdHJ1ZTtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIGdldFJldHVybihWbm9kZSkge1xuICAgIGlmIChWbm9kZS5yZXR1cm4gPT09IHZvaWQgNjY2KSB7XG4gICAgICAgIHJldHVybiBWbm9kZVxuICAgIH0gZWxzZSB7XG4gICAgICAgIGlmIChWbm9kZS5kaXNwbGF5TmFtZSA9PT0gdm9pZCA2NjYpIHtcbiAgICAgICAgICAgIHJldHVybiBWbm9kZS5yZXR1cm5cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBWbm9kZVxuICAgICAgICB9XG4gICAgfVxufVxuXG5mdW5jdGlvbiBnZXROYW1lKFZub2RlLCB0eXBlKSB7XG4gICAgY29uc3QgdHlwZV9udW1iZXIgPSB0eXBlTnVtYmVyKHR5cGUpO1xuICAgIGlmICh0eXBlX251bWJlciA9PT0gNCkge1xuICAgICAgICByZXR1cm4gdHlwZVxuICAgIH1cbiAgICBpZiAodHlwZV9udW1iZXIgPT09IDUpIHtcbiAgICAgICAgaWYgKFZub2RlLl9ob3N0Tm9kZSkge1xuICAgICAgICAgICAgcmV0dXJuIFZub2RlLl9ob3N0Tm9kZS50YWdOYW1lXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gVm5vZGUudHlwZS5uYW1lXG4gICAgICAgIH1cbiAgICB9XG5cbn1cblxuZnVuY3Rpb24gcHVzaEVycm9yVm5vZGUoVm5vZGUpIHtcbiAgICBfZXJyb3JWbm9kZS5wdXNoKFZub2RlKTtcbn1cblxuZnVuY3Rpb24gY29sbGVjdEVycm9yVm5vZGUoZXJyb3IsIF9Wbm9kZSwgaG9va25hbWUpIHtcbiAgICB2YXIgVm5vZGUgPSBfVm5vZGUgPT09IHZvaWQgNjY2ID8gdm9pZCA2NjYgOiBfVm5vZGUucmV0dXJuO1xuICAgIGNvbnN0IGVycm9yX2FyeSA9IFtdO1xuICAgIGRvIHtcbiAgICAgICAgaWYgKFZub2RlID09PSB2b2lkIDY2NikgYnJlYWs7XG5cbiAgICAgICAgZXJyb3JfYXJ5LnB1c2goVm5vZGUpO1xuICAgICAgICBpZiAoVm5vZGUucmV0dXJuIHx8IFZub2RlLmlzVG9wID09PSB0cnVlKSB7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIGVycm9yTXNnICs9IGBpbiA8JHtWbm9kZS5kaXNwbGF5TmFtZSB8fCBnZXROYW1lKFZub2RlLCBWbm9kZS50eXBlKX0vPiBjcmVhdGVkIGJ5ICR7Vm5vZGUucmV0dXJuLmRpc3BsYXlOYW1lIHx8IGdldE5hbWUoVm5vZGUucmV0dXJuLCBWbm9kZS5yZXR1cm4udHlwZSl9XFxuYDtcbiAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcblxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKFZub2RlLl9pbnN0YW5jZSkge1xuICAgICAgICAgICAgICAgIGlmIChWbm9kZS5faW5zdGFuY2UuY29tcG9uZW50RGlkQ2F0Y2gpIHtcbiAgICAgICAgICAgICAgICAgICAgVl9JbnN0YW5jZS5wdXNoKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGluc3RhbmNlOiBWbm9kZS5faW5zdGFuY2UsXG4gICAgICAgICAgICAgICAgICAgICAgICBjb21wb25lbnREaWRDYXRjaDogVm5vZGUuX2luc3RhbmNlLmNvbXBvbmVudERpZENhdGNoXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhgPCR7Vm5vZGUuZGlzcGxheU5hbWUgfHwgZ2V0TmFtZShWbm9kZSwgVm5vZGUudHlwZSl9Lz4g5oul5pyJ5Yy755Sf6IqC54K555qE6IO95YqbYClcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICB3aGlsZSAoVm5vZGUgPSBWbm9kZS5yZXR1cm4pO1xuICAgIGlmIChWX0luc3RhbmNlLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICB0aHJvdyBlcnJvcjtcbiAgICB9IGVsc2Uge1xuICAgICAgICBnbG9iYWxFcnJvciA9IGVycm9yO1xuICAgIH1cbn1cblxuZnVuY3Rpb24gcnVuRXhjZXB0aW9uKCkge1xuICAgIHZhciBpbnMgPSBWX0luc3RhbmNlLnNoaWZ0KClcbiAgICBpZiAoaW5zID09PSB2b2lkIDY2Nikge1xuICAgICAgICBpZiAoZXJyb3JNc2cgIT09ICcnKSB7XG4gICAgICAgICAgICAvLyBjb25zb2xlLndhcm4oZXJyb3JNc2cpXG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuXG4gICAgfVxuICAgIGRvIHtcblxuICAgICAgICBjb25zdCB7aW5zdGFuY2UsIGNvbXBvbmVudERpZENhdGNofSA9IGlucztcbiAgICAgICAgaWYgKGNvbXBvbmVudERpZENhdGNoKSB7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIGluc3RhbmNlLmxpZmVDeWNsZSA9IENvbS5DQVRDSElORztcbiAgICAgICAgICAgICAgICBjb21wb25lbnREaWRDYXRjaC5jYWxsKGluc3RhbmNlLCBnbG9iYWxFcnJvciwgZXJyb3JNc2cpO1xuICAgICAgICAgICAgICAgIGluc3RhbmNlLl91cGRhdGVJbkxpZmVDeWNsZSgpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgICAgIC8vIGlmIChpbnN0YW5jZS5jb21wb25lbnRXaWxsVW5tb3VudCkge1xuICAgICAgICAgICAgICAgIC8vICAgICBpbnN0YW5jZS5jb21wb25lbnRXaWxsVW5tb3VudCgpO1xuICAgICAgICAgICAgICAgIC8vIH1cbiAgICAgICAgICAgICAgICAvLyBkaXNwb3NlVm5vZGUoaW5zdGFuY2UuVm5vZGUpO1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGUsICflpJrkuKrplJnor6/lj5HnlJ/vvIzmraTlpITlj6rlpITnkIbkuIDkuKrplJnor68nKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGRpc3Bvc2VWbm9kZShpbnN0YW5jZS5Wbm9kZSk7XG4gICAgICAgIH1cbiAgICB9IHdoaWxlIChpbnMgPSBWX0luc3RhbmNlLnNoaWZ0KCkpXG59XG5cblxuZXhwb3J0IHtcbiAgICBjYXRjaEVycm9yLFxuICAgIGdldFJldHVybixcbiAgICBjb2xsZWN0RXJyb3JWbm9kZSxcbiAgICBydW5FeGNlcHRpb24sXG59O1xuIiwiLyoq5LqL5Lu25ZCI5oiQ77yM5pqC5pe26L+Z5LmI5YaZICovXG5mdW5jdGlvbiBTeW50aGV0aWNFdmVudChldmVudCkge1xuICAgIGlmIChldmVudC5uYXRpdmVFdmVudCkge1xuICAgICAgICByZXR1cm4gZXZlbnQ7XG4gICAgfVxuICAgIGZvciAodmFyIGkgaW4gZXZlbnQpIHtcbiAgICAgICAgaWYgKCFldmVudFByb3RvW2ldKSB7XG4gICAgICAgICAgICB0aGlzW2ldID0gZXZlbnRbaV07XG4gICAgICAgIH1cbiAgICB9XG4gICAgaWYgKCF0aGlzLnRhcmdldCkge1xuICAgICAgICB0aGlzLnRhcmdldCA9IGV2ZW50LnNyY0VsZW1lbnQ7XG4gICAgfVxuICAgIHRoaXMuZml4RXZlbnQoKTtcbiAgICB0aGlzLnRpbWVTdGFtcCA9IG5ldyBEYXRlKCkgLSAwO1xuICAgIHRoaXMubmF0aXZlRXZlbnQgPSBldmVudDtcbn1cblxudmFyIGV2ZW50UHJvdG8gPSBTeW50aGV0aWNFdmVudC5wcm90b3R5cGUgPSB7XG4gICAgZml4RXZlbnQ6IGZ1bmN0aW9uIGZpeEV2ZW50KCkge1xuICAgIH0sIC8v55WZ57uZ5Lul5ZCO5omp5bGV55SoXG4gICAgcHJldmVudERlZmF1bHQ6IGZ1bmN0aW9uIHByZXZlbnREZWZhdWx0KCkge1xuICAgICAgICB2YXIgZSA9IHRoaXMubmF0aXZlRXZlbnQgfHwge307XG4gICAgICAgIGUucmV0dXJuVmFsdWUgPSB0aGlzLnJldHVyblZhbHVlID0gZmFsc2U7XG4gICAgICAgIGlmIChlLnByZXZlbnREZWZhdWx0KSB7XG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIGZpeEhvb2tzOiBmdW5jdGlvbiBmaXhIb29rcygpIHtcbiAgICB9LFxuICAgIHN0b3BQcm9wYWdhdGlvbjogZnVuY3Rpb24gc3RvcFByb3BhZ2F0aW9uKCkge1xuICAgICAgICB2YXIgZSA9IHRoaXMubmF0aXZlRXZlbnQgfHwge307XG4gICAgICAgIGUuY2FuY2VsQnViYmxlID0gdGhpcy5fc3RvcFByb3BhZ2F0aW9uID0gdHJ1ZTtcbiAgICAgICAgaWYgKGUuc3RvcFByb3BhZ2F0aW9uKSB7XG4gICAgICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICB9XG4gICAgfSxcbiAgICBwZXJzaXN0OiBmdW5jdGlvbiBub29wKCkge1xuICAgIH0sXG4gICAgc3RvcEltbWVkaWF0ZVByb3BhZ2F0aW9uOiBmdW5jdGlvbiBzdG9wSW1tZWRpYXRlUHJvcGFnYXRpb24oKSB7XG4gICAgICAgIHRoaXMuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgIHRoaXMuc3RvcEltbWVkaWF0ZSA9IHRydWU7XG4gICAgfSxcbiAgICB0b1N0cmluZzogZnVuY3Rpb24gdG9TdHJpbmcoKSB7XG4gICAgICAgIHJldHVybiBcIltvYmplY3QgRXZlbnRdXCI7XG4gICAgfVxufTtcblxuZXhwb3J0IHtcbiAgICBTeW50aGV0aWNFdmVudCxcbn07XG4iLCJpbXBvcnQge2NyZWF0ZUVsZW1lbnR9IGZyb20gJy4vY3JlYXRlRWxlbWVudCdcbmltcG9ydCB7Y2xvbmVFbGVtZW50fSBmcm9tICcuL2Nsb25lRWxlbWVudCdcbmltcG9ydCB7Q2hpbGRyZW59IGZyb20gJy4vY2hpbGRyZW4nXG5pbXBvcnQge3JlbmRlciwgZmluZERPTU5vZGUsIGNyZWF0ZVBvcnRhbH0gZnJvbSAnLi92ZG9tJ1xuaW1wb3J0IHtSZWFjdENsYXNzfSBmcm9tICcuL2NvbXBvbmVudCdcblxuY29uc3QgUmVhY3QgPSB7XG4gICAgZmluZERPTU5vZGUsXG4gICAgLy8gYmFiZWznmoTpu5jorqTorr7nva7mmK/osIPnlKhjcmVhdGVFbGVtZW506L+Z5Liq5Ye95pWwXG4gICAgY3JlYXRlRWxlbWVudCxcbiAgICByZW5kZXIsXG4gICAgY2xvbmVFbGVtZW50LFxuICAgIGNyZWF0ZVBvcnRhbCxcbiAgICBDaGlsZHJlbixcbiAgICBDb21wb25lbnQ6IFJlYWN0Q2xhc3MsXG59O1xuXG5cbmV4cG9ydCB7XG4gICAgUmVhY3RDbGFzcyBhcyBDb21wb25lbnQsXG4gICAgQ2hpbGRyZW4sXG4gICAgY3JlYXRlRWxlbWVudCxcbn07XG5leHBvcnQgZGVmYXVsdCBSZWFjdDtcbiIsImltcG9ydCB7dHlwZU51bWJlciwgaXNFdmVudE5hbWUsIGlzRXZlbnROYW1lTG93ZXJDYXNlLCBvcHRpb25zLCBzdHlsZUhlbHBlciwgbm9vcH0gZnJvbSBcIi4vdXRpbHNcIjtcbmltcG9ydCB7U3ludGhldGljRXZlbnR9IGZyb20gJy4vZXZlbnQnXG5pbXBvcnQge21hcENvbnRyb2xsZWRFbGVtZW50fSBmcm9tICcuL2NvbnRyb2xsZWRDb21wb25lbnQnXG5cbmNvbnN0IGZvcm1FbGVtZW50ID0ge1xuICAgIElOUFVUOiB0cnVlLFxuICAgIFNFTEVDVDogdHJ1ZSxcbiAgICBURVhUQVJFQTogdHJ1ZVxufVxuXG5mdW5jdGlvbiBpc0Zvcm1FbGVtZW50KGRvbU5vZGUpIHtcbiAgICBpZiAoZG9tTm9kZSkge1xuICAgICAgICByZXR1cm4gZm9ybUVsZW1lbnRbZG9tTm9kZS5ub2RlTmFtZV1cbiAgICB9XG59XG5cbmZ1bmN0aW9uIG1hcFByb3AoZG9tTm9kZSwgcHJvcHMsIFZub2RlKSB7XG4gICAgaWYgKFZub2RlICYmIHR5cGVvZiBWbm9kZS50eXBlID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIC8v5aaC5p6c5piv57uE5Lu277yM5YiZ5LiN6KaBbWFw5LuW55qEcHJvcHPov5vmnaVcbiAgICAgICAgcmV0dXJuXG4gICAgfVxuXG4gICAgaWYgKGlzRm9ybUVsZW1lbnQoZG9tTm9kZSkpIHtcbiAgICAgICAgbWFwQ29udHJvbGxlZEVsZW1lbnQoZG9tTm9kZSwgcHJvcHMpXG4gICAgfVxuICAgIGZvciAobGV0IG5hbWUgaW4gcHJvcHMpIHtcbiAgICAgICAgaWYgKG5hbWUgPT09ICdjaGlsZHJlbicpIGNvbnRpbnVlXG4gICAgICAgIGlmIChpc0V2ZW50TmFtZShuYW1lKSkge1xuICAgICAgICAgICAgbGV0IGV2ZW50TmFtZSA9IG5hbWUuc2xpY2UoMikudG9Mb3dlckNhc2UoKSAvL1xuICAgICAgICAgICAgbWFwcGluZ1N0cmF0ZWd5WydldmVudCddKGRvbU5vZGUsIHByb3BzW25hbWVdLCBldmVudE5hbWUpXG4gICAgICAgICAgICBjb250aW51ZVxuICAgICAgICB9XG4gICAgICAgIGlmICh0eXBlb2YgbWFwcGluZ1N0cmF0ZWd5W25hbWVdID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICBtYXBwaW5nU3RyYXRlZ3lbbmFtZV0oZG9tTm9kZSwgcHJvcHNbbmFtZV0pXG4gICAgICAgIH1cbiAgICAgICAgaWYgKG1hcHBpbmdTdHJhdGVneVtuYW1lXSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBtYXBwaW5nU3RyYXRlZ3lbJ290aGVyUHJvcHMnXShkb21Ob2RlLCBwcm9wc1tuYW1lXSwgbmFtZSlcbiAgICAgICAgfVxuICAgIH1cbn1cblxuIGZ1bmN0aW9uIGNsZWFyRXZlbnRzKGRvbU5vZGUsIHByb3BzLCBWbm9kZSkge1xuICAgIGNvbnNvbGUubG9nKGRvbU5vZGUpXG4gICAgZm9yIChsZXQgbmFtZSBpbiBwcm9wcykge1xuICAgICAgICBpZiAobmFtZSA9PT0gJ2NoaWxkcmVuJykgY29udGludWVcbiAgICAgICAgaWYgKGlzRXZlbnROYW1lKG5hbWUpKSB7XG4gICAgICAgICAgICBsZXQgZXZlbnROYW1lID0gbmFtZS5zbGljZSgyKS50b0xvd2VyQ2FzZSgpIC8vXG4gICAgICAgICAgICBtYXBwaW5nU3RyYXRlZ3lbJ2NsZWFyRXZlbnRzJ10oZG9tTm9kZSwgcHJvcHNbbmFtZV0sIGV2ZW50TmFtZSlcbiAgICAgICAgICAgIGNvbnRpbnVlXG4gICAgICAgIH1cbiAgICB9XG59XG5cblxuIGZ1bmN0aW9uIHVwZGF0ZVByb3BzKG9sZFByb3BzLCBuZXdQcm9wcywgaG9zdE5vZGUpIHtcbiAgICBmb3IgKGxldCBuYW1lIGluIG9sZFByb3BzKSB7Ly/kv67mlLnljp/mnaXmnInnmoTlsZ7mgKdcbiAgICAgICAgaWYgKG5hbWUgPT09ICdjaGlsZHJlbicpIGNvbnRpbnVlXG5cbiAgICAgICAgaWYgKG9sZFByb3BzW25hbWVdICE9PSBuZXdQcm9wc1tuYW1lXSkge1xuICAgICAgICAgICAgbWFwUHJvcChob3N0Tm9kZSwgbmV3UHJvcHMpXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBsZXQgcmVzdFByb3BzID0ge31cbiAgICBmb3IgKGxldCBuZXdOYW1lIGluIG5ld1Byb3BzKSB7Ly/mlrDlop7ljp/mnaXmsqHmnInnmoTlsZ7mgKdcbiAgICAgICAgaWYgKG9sZFByb3BzW25ld05hbWVdID09PSB2b2lkIDY2Nikge1xuICAgICAgICAgICAgcmVzdFByb3BzW25ld05hbWVdID0gbmV3UHJvcHNbbmV3TmFtZV1cbiAgICAgICAgfVxuICAgIH1cbiAgICBtYXBQcm9wKGhvc3ROb2RlLCByZXN0UHJvcHMpXG5cbn1cblxudmFyIHJlZ2lzdGVyZEV2ZW50ID0ge31cbmNvbnN0IGNvbnRyb2xsZWRFdmVudCA9IHtcbiAgICBjaGFuZ2U6IDEsXG4gICAgaW5wdXQ6IDFcbn1cblxuZnVuY3Rpb24gY3JlYXRlSGFuZGxlKGUpIHtcbiAgICBkaXNwYXRjaEV2ZW50KGUsICdjaGFuZ2UnKTtcbn1cblxuY29uc3Qgc3BlY2lhbEhvb2sgPSB7XG4gICAgLy9yZWFjdOWwhnRleHQsdGV4dGFyZWEscGFzc3dvcmTlhYPntKDkuK3nmoRvbkNoYW5nZeS6i+S7tuW9k+aIkG9uSW5wdXTkuovku7ZcbiAgICBjaGFuZ2U6IGZ1bmN0aW9uIChkb20pIHtcbiAgICAgICAgaWYgKC90ZXh0fHBhc3N3b3JkLy50ZXN0KGRvbS50eXBlKSkge1xuICAgICAgICAgICAgYWRkRXZlbnQoZG9jdW1lbnQsIGNyZWF0ZUhhbmRsZSwgXCJpbnB1dFwiKTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuXG4gY29uc3QgbWFwcGluZ1N0cmF0ZWd5ID0ge1xuICAgIHN0eWxlOiBmdW5jdGlvbiAoZG9tTm9kZSwgc3R5bGUpIHtcbiAgICAgICAgaWYgKHN0eWxlICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIE9iamVjdC5rZXlzKHN0eWxlKS5mb3JFYWNoKChzdHlsZU5hbWUpID0+IHtcbiAgICAgICAgICAgICAgICBkb21Ob2RlLnN0eWxlW3N0eWxlTmFtZV0gPSBzdHlsZUhlbHBlcihzdHlsZU5hbWUsIHN0eWxlW3N0eWxlTmFtZV0pXG4gICAgICAgICAgICB9KVxuICAgICAgICB9XG4gICAgfSxcbiAgICBjbGVhckV2ZW50czogZnVuY3Rpb24gKGRvbU5vZGUsIGV2ZW50Q2IsIGV2ZW50TmFtZSkge1xuICAgICAgICBsZXQgZXZlbnRzID0gZG9tTm9kZS5fX2V2ZW50cyB8fCB7fVxuICAgICAgICBldmVudHNbZXZlbnROYW1lXSA9IG5vb3A7XG4gICAgICAgIGRvbU5vZGUuX19ldmVudHMgPSBldmVudHMvL+eUqOS6jnRyaWdnZXJFdmVudEJ5UGF0aOS4reiOt+WPlmV2ZW50XG4gICAgfSxcbiAgICBldmVudDogZnVuY3Rpb24gKGRvbU5vZGUsIGV2ZW50Q2IsIGV2ZW50TmFtZSkge1xuICAgICAgICBsZXQgZXZlbnRzID0gZG9tTm9kZS5fX2V2ZW50cyB8fCB7fVxuICAgICAgICBldmVudHNbZXZlbnROYW1lXSA9IGV2ZW50Q2JcbiAgICAgICAgZG9tTm9kZS5fX2V2ZW50cyA9IGV2ZW50cy8v55So5LqOdHJpZ2dlckV2ZW50QnlQYXRo5Lit6I635Y+WZXZlbnRcblxuICAgICAgICBpZiAoIXJlZ2lzdGVyZEV2ZW50W2V2ZW50TmFtZV0pIHsvL+aJgOacieS6i+S7tuWPquazqOWGjOS4gOasoVxuICAgICAgICAgICAgcmVnaXN0ZXJkRXZlbnRbZXZlbnROYW1lXSA9IDFcblxuICAgICAgICAgICAgaWYgKHNwZWNpYWxIb29rW2V2ZW50TmFtZV0pIHtcbiAgICAgICAgICAgICAgICBzcGVjaWFsSG9va1tldmVudE5hbWVdKGRvbU5vZGUpXG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGFkZEV2ZW50KGRvY3VtZW50LCBkaXNwYXRjaEV2ZW50LCBldmVudE5hbWUpXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9LFxuICAgIGNsYXNzTmFtZTogZnVuY3Rpb24gKGRvbU5vZGUsIGNsYXNzTmFtZSkge1xuICAgICAgICBpZiAoY2xhc3NOYW1lICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIGRvbU5vZGUuY2xhc3NOYW1lID0gY2xhc3NOYW1lXG4gICAgICAgIH1cbiAgICB9LFxuICAgIGRhbmdlcm91c2x5U2V0SW5uZXJIVE1MOiBmdW5jdGlvbiAoZG9tTm9kZSwgaHRtbCkge1xuICAgICAgICBsZXQgb2xkaHRtbCA9IGRvbU5vZGUuaW5uZXJIVE1MXG4gICAgICAgIGlmIChodG1sLl9faHRtbCAhPT0gb2xkaHRtbCkge1xuICAgICAgICAgICAgZG9tTm9kZS5pbm5lckhUTUwgPSBodG1sLl9faHRtbFxuICAgICAgICB9XG4gICAgfSxcbiAgICBvdGhlclByb3BzOiBmdW5jdGlvbiAoZG9tTm9kZSwgcHJvcCwgcHJvcE5hbWUpIHtcbiAgICAgICAgaWYgKHByb3AgIT09IHZvaWQgNjY2IHx8IHByb3BOYW1lICE9PSB2b2lkIDY2Nikge1xuICAgICAgICAgICAgZG9tTm9kZVtwcm9wTmFtZV0gPSBwcm9wXG4gICAgICAgIH1cbiAgICB9XG59XG5cblxuZnVuY3Rpb24gYWRkRXZlbnQoZG9tTm9kZSwgZm4sIGV2ZW50TmFtZSkge1xuXG4gICAgaWYgKGRvbU5vZGUuYWRkRXZlbnRMaXN0ZW5lcikge1xuICAgICAgICBkb21Ob2RlLmFkZEV2ZW50TGlzdGVuZXIoXG4gICAgICAgICAgICBldmVudE5hbWUsXG4gICAgICAgICAgICBmbixcbiAgICAgICAgICAgIGZhbHNlXG4gICAgICAgICk7XG5cbiAgICB9IGVsc2UgaWYgKGRvbU5vZGUuYXR0YWNoRXZlbnQpIHtcbiAgICAgICAgZG9tTm9kZS5hdHRhY2hFdmVudChcIm9uXCIgKyBldmVudE5hbWUsIGZuKTtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIGRpc3BhdGNoRXZlbnQoZXZlbnQsIGV2ZW50TmFtZSwgZW5kKSB7XG4gICAgY29uc3QgcGF0aCA9IGdldEV2ZW50UGF0aChldmVudCwgZW5kKVxuICAgIGxldCBFID0gbmV3IFN5bnRoZXRpY0V2ZW50KGV2ZW50KVxuICAgIG9wdGlvbnMuYXN5bmMgPSB0cnVlXG4gICAgaWYgKGV2ZW50TmFtZSkge1xuICAgICAgICBFLnR5cGUgPSBldmVudE5hbWVcbiAgICB9XG5cbiAgICB0cmlnZ2VyRXZlbnRCeVBhdGgoRSwgcGF0aCkvL+inpuWPkWV2ZW506buY6K6k5Lul5YaS5rOh5b2i5byPXG4gICAgb3B0aW9ucy5hc3luYyA9IGZhbHNlXG4gICAgZm9yIChsZXQgZGlydHkgaW4gb3B0aW9ucy5kaXJ0eUNvbXBvbmVudCkge1xuICAgICAgICBvcHRpb25zLmRpcnR5Q29tcG9uZW50W2RpcnR5XS51cGRhdGVDb21wb25lbnQoKVxuICAgIH1cbiAgICBvcHRpb25zLmRpcnR5Q29tcG9uZW50ID0ge30vL+a4heepulxufVxuXG4vKipcbiAqIOinpuWPkWV2ZW506buY6K6k5Lul5YaS5rOh5b2i5byPXG4gKiDlhpLms6HvvJrku47ph4zliLDlpJZcbiAqIOaNleiOt++8muS7juWkluWIsOmHjFxuICogQHBhcmFtIHthcnJheX0gcGF0aFxuICovXG5mdW5jdGlvbiB0cmlnZ2VyRXZlbnRCeVBhdGgoZSwgcGF0aDogQXJyYXkpIHtcbiAgICBjb25zdCB0aGlzRXZlblR5cGUgPSBlLnR5cGVcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHBhdGgubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgY29uc3QgZXZlbnRzID0gcGF0aFtpXS5fX2V2ZW50c1xuICAgICAgICBmb3IgKGxldCBldmVudE5hbWUgaW4gZXZlbnRzKSB7XG4gICAgICAgICAgICBsZXQgZm4gPSBldmVudHNbZXZlbnROYW1lXVxuICAgICAgICAgICAgZS5jdXJyZW50VGFyZ2V0ID0gcGF0aFtpXVxuICAgICAgICAgICAgaWYgKHR5cGVvZiBmbiA9PT0gJ2Z1bmN0aW9uJyAmJiB0aGlzRXZlblR5cGUgPT09IGV2ZW50TmFtZSkge1xuXG4gICAgICAgICAgICAgICAgZm4uY2FsbChwYXRoW2ldLCBlKS8v6Kem5Y+R5Zue6LCD5Ye95pWw6buY6K6k5Lul5YaS5rOh5b2i5byPXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG59XG5cbi8qKlxuICog5b2T6Kem5Y+RZXZlbnTnmoTml7blgJnvvIzmiJHku6zliKnnlKjov5nkuKrlh73mlbBcbiAqIOWOu+Wvu+aJvuinpuWPkei3r+W+hOS4iuacieWHveaVsOWbnuiwg+eahOi3r+W+hFxuICogQHBhcmFtIHtldmVudH0gZXZlbnRcbiAqL1xuIGZ1bmN0aW9uIGdldEV2ZW50UGF0aChldmVudCwgZW5kKSB7XG4gICAgbGV0IHBhdGggPSBbXVxuICAgIGxldCBwYXRoRW5kID0gZW5kIHx8IGRvY3VtZW50XG4gICAgbGV0IGJlZ2luOiBFbGVtZW50ID0gZXZlbnQudGFyZ2V0XG5cbiAgICB3aGlsZSAoMSkge1xuICAgICAgICBpZiAoYmVnaW4uX19ldmVudHMpIHtcbiAgICAgICAgICAgIHBhdGgucHVzaChiZWdpbilcbiAgICAgICAgfVxuICAgICAgICBiZWdpbiA9IGJlZ2luLnBhcmVudE5vZGUvL+i/reS7o1xuICAgICAgICBpZiAoYmVnaW4gJiYgYmVnaW4uX1BvcnRhbEhvc3ROb2RlKSB7XG4gICAgICAgICAgICBiZWdpbiA9IGJlZ2luLl9Qb3J0YWxIb3N0Tm9kZVxuICAgICAgICB9XG4gICAgICAgIGlmICghYmVnaW4pIHtcbiAgICAgICAgICAgIGJyZWFrXG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHBhdGhcbn1cblxuXG5leHBvcnQge1xuICAgIG1hcFByb3AsXG4gICAgY2xlYXJFdmVudHMsXG4gICAgdXBkYXRlUHJvcHMsXG4gICAgbWFwcGluZ1N0cmF0ZWd5LFxuICAgIGdldEV2ZW50UGF0aCxcbn07XG4iLCJpbXBvcnQge3R5cGVOdW1iZXJ9IGZyb20gJy4vdXRpbHMnXG5cbmZ1bmN0aW9uIHNldFJlZihWbm9kZSwgaW5zdGFuY2UsIGRvbU5vZGUpIHtcbiAgICBpZiAoaW5zdGFuY2UpIHtcbiAgICAgICAgY29uc3QgcmVmVHlwZSA9IHR5cGVOdW1iZXIoVm5vZGUucmVmKVxuICAgICAgICBpZiAocmVmU3RyYXRlZ3lbcmVmVHlwZV0pIHtcbiAgICAgICAgICAgIHJlZlN0cmF0ZWd5W3JlZlR5cGVdKFZub2RlLCBWbm9kZS5vd25lciwgZG9tTm9kZSlcbiAgICAgICAgfVxuICAgIH1cbn1cblxuZnVuY3Rpb24gY2xlYXJSZWZzKHJlZnMpIHtcbiAgICBpZiAodHlwZW9mIHJlZnMgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgcmVmcyhudWxsKVxuICAgIH0gZWxzZSB7XG4gICAgICAgIGZvciAobGV0IHJlZk5hbWUgaW4gcmVmcykge1xuICAgICAgICAgICAgcmVmc1tyZWZOYW1lXSA9IG51bGxcbiAgICAgICAgfVxuICAgIH1cbn1cblxuY29uc3QgcmVmU3RyYXRlZ3kgPSB7XG4gICAgMzogZnVuY3Rpb24gKFZub2RlLCBpbnN0YW5jZSwgZG9tTm9kZSkge1xuICAgICAgICBpZiAoVm5vZGUuX2luc3RhbmNlKSB7XG4gICAgICAgICAgICBpbnN0YW5jZS5yZWZzW1Zub2RlLnJlZl0gPSBWbm9kZS5faW5zdGFuY2VcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGluc3RhbmNlLnJlZnNbVm5vZGUucmVmXSA9IGRvbU5vZGVcbiAgICAgICAgfVxuICAgIH0sXG4gICAgNDogZnVuY3Rpb24gKFZub2RlLCBpbnN0YW5jZSwgZG9tTm9kZSkge1xuICAgICAgICByZWZTdHJhdGVneVszXShWbm9kZSwgaW5zdGFuY2UsIGRvbU5vZGUpXG4gICAgfSxcbiAgICA1OiBmdW5jdGlvbiAoVm5vZGUsIGluc3RhbmNlLCBkb21Ob2RlKSB7XG4gICAgICAgIGlmIChWbm9kZS5faW5zdGFuY2UpIHtcbiAgICAgICAgICAgIFZub2RlLnJlZihWbm9kZS5faW5zdGFuY2UpXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBWbm9kZS5yZWYoZG9tTm9kZSlcbiAgICAgICAgfVxuICAgIH1cbn1cblxuZXhwb3J0IHtcbiAgICBzZXRSZWYsXG4gICAgY2xlYXJSZWZzLFxufVxuIiwibGV0IF9fdHlwZSA9IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmc7XG5cbnZhciBvcHRpb25zID0ge1xuICAgIGFzeW5jOiBmYWxzZSxcbiAgICBkaXJ0eUNvbXBvbmVudDoge31cbn1cblxudmFyIG51bWJlck1hcCA9IHtcbiAgICAvL251bGwgdW5kZWZpbmVkIElFNi046L+Z6YeM5Lya6L+U5ZueW29iamVjdCBPYmplY3RdXG4gICAgXCJbb2JqZWN0IEJvb2xlYW5dXCI6IDIsXG4gICAgXCJbb2JqZWN0IE51bWJlcl1cIjogMyxcbiAgICBcIltvYmplY3QgU3RyaW5nXVwiOiA0LFxuICAgIFwiW29iamVjdCBGdW5jdGlvbl1cIjogNSxcbiAgICBcIltvYmplY3QgU3ltYm9sXVwiOiA2LFxuICAgIFwiW29iamVjdCBBcnJheV1cIjogN1xufTtcblxuLyoqXG4gKiDnu5nmlbDlrZfnsbvnmoTliqDkuIoncHgnXG4gKiBAcGFyYW0geyp9IHN0eWxlTnVtYmVyXG4gKi9cbmNvbnN0IHNwZWNpYWxTdHlsZSA9IHtcbiAgICB6SW5kZXg6IDFcbn1cblxuXG5mdW5jdGlvbiBzdHlsZUhlbHBlcihzdHlsZU5hbWUsIHN0eWxlTnVtYmVyKSB7XG4gICAgaWYgKHR5cGVOdW1iZXIoc3R5bGVOdW1iZXIpID09PSAzKSB7XG4gICAgICAgIGNvbnN0IHN0eWxlID0gc3BlY2lhbFN0eWxlW3N0eWxlTmFtZV0gPyBzdHlsZU51bWJlciA6IHN0eWxlTnVtYmVyICsgJ3B4J1xuICAgICAgICByZXR1cm4gc3R5bGVcbiAgICB9XG4gICAgcmV0dXJuIHN0eWxlTnVtYmVyXG59XG5cblxuLyoqXG4gKiB1bmRlZmluZWQ6IDAsIG51bGw6IDEsIGJvb2xlYW46MiwgbnVtYmVyOiAzLCBzdHJpbmc6IDQsIGZ1bmN0aW9uOiA1LCBzeW1ib2w6NiwgYXJyYXk6IDcsIG9iamVjdDo4XG4gKiBAcGFyYW0ge2FueX0gZGF0YVxuICovXG5mdW5jdGlvbiB0eXBlTnVtYmVyKGRhdGEpIHtcbiAgICBpZiAoZGF0YSA9PT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gMTtcbiAgICB9XG4gICAgaWYgKGRhdGEgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICByZXR1cm4gMDtcbiAgICB9XG4gICAgdmFyIGEgPSBudW1iZXJNYXBbX190eXBlLmNhbGwoZGF0YSldO1xuICAgIHJldHVybiBhIHx8IDg7XG59XG5cblxuLyoqXG4gKiDlr7nmr5TmlrDml6dWbm9kZeaYr+WQpuS4gOagt1xuICogQHBhcmFtIHtWbm9kZX0gcHJlXG4gKiBAcGFyYW0ge1Zub2RlfSBuZXh0XG4gKi9cbmZ1bmN0aW9uIGlzU2FtZVZub2RlKHByZSwgbmV4dCkge1xuICAgIGlmIChwcmUudHlwZSA9PT0gbmV4dC50eXBlICYmIHByZS5rZXkgPT09IG5leHQua2V5KSB7XG4gICAgICAgIHJldHVybiB0cnVlXG4gICAgfVxuICAgIHJldHVybiBmYWxzZVxufVxuXG5cbi8qKlxuICog5bCG6IqC54K555qEa2V55pS+5YWlbWFw5LitXG4gKlxuICogQHBhcmFtIHtWbm9kZX0gb2xkXG4gKi9cbmZ1bmN0aW9uIG1hcEtleVRvSW5kZXgob2xkKSB7XG4gICAgbGV0IGhhc2NvZGUgPSB7fVxuICAgIG9sZC5mb3JFYWNoKChlbCwgaW5kZXgpID0+IHtcbiAgICAgICAgaWYgKGVsLmtleSkge1xuICAgICAgICAgICAgaGFzY29kZVtlbC5rZXldID0gaW5kZXhcbiAgICAgICAgfVxuICAgIH0pXG4gICAgcmV0dXJuIGhhc2NvZGVcbn1cblxuXG4vKipcbiAqIOWIpOWumuWQpuS4uuS4juS6i+S7tuebuOWFs1xuICpcbiAqIEBwYXJhbSB7YW55fSBuYW1lXG4gKiBAcmV0dXJuc1xuICovXG5mdW5jdGlvbiBpc0V2ZW50TmFtZShuYW1lKSB7XG4gICAgcmV0dXJuIC9eb25bQS1aXS8udGVzdChuYW1lKTtcbn1cblxuZnVuY3Rpb24gaXNFdmVudE5hbWVMb3dlckNhc2UobmFtZSkge1xuICAgIHJldHVybiAvXm9uW2Etel0vLnRlc3QobmFtZSk7XG59XG5cbi8qKlxuICog5bGV5byA5a+56LGhXG4gKiBAcGFyYW0geyp9IG9ialxuICogQHBhcmFtIHsqfSBwcm9wc1xuICovXG5cbmZ1bmN0aW9uIGV4dGVuZChvYmosIHByb3BzKSB7XG4gICAgZm9yIChsZXQgaSBpbiBwcm9wcykgb2JqW2ldID0gcHJvcHNbaV07XG4gICAgcmV0dXJuIG9iajtcbn1cblxuLyoqXG4gKiDnqbrlh73mlbBcbiAqL1xuY29uc3Qgbm9vcCA9ICgpID0+IHtcblxufVxuXG5leHBvcnQge1xuICAgIG9wdGlvbnMsXG4gICAgc3R5bGVIZWxwZXIsXG4gICAgdHlwZU51bWJlcixcbiAgICBpc1NhbWVWbm9kZSxcbiAgICBtYXBLZXlUb0luZGV4LFxuICAgIGlzRXZlbnROYW1lLFxuICAgIGlzRXZlbnROYW1lTG93ZXJDYXNlLFxuICAgIGV4dGVuZCxcbiAgICBub29wLFxufVxuIiwiaW1wb3J0IHt0eXBlTnVtYmVyLCBpc1NhbWVWbm9kZSwgbWFwS2V5VG9JbmRleCwgaXNFdmVudE5hbWUsIGV4dGVuZCwgb3B0aW9uc30gZnJvbSBcIi4vdXRpbHNcIjtcbmltcG9ydCB7ZmxhdHRlbkNoaWxkcmVuLCBWbm9kZSBhcyBWbm9kZUNsYXNzfSBmcm9tICcuL2NyZWF0ZUVsZW1lbnQnXG5pbXBvcnQge21hcFByb3AsIG1hcHBpbmdTdHJhdGVneSwgdXBkYXRlUHJvcHN9IGZyb20gJy4vbWFwUHJvcHMnXG5pbXBvcnQge3NldFJlZn0gZnJvbSAnLi9yZWZzJ1xuaW1wb3J0IHtkaXNwb3NlVm5vZGV9IGZyb20gJy4vZGlzcG9zZSdcbmltcG9ydCB7Q29tfSBmcm9tICcuL2NvbXBvbmVudCdcbmltcG9ydCB7Y2F0Y2hFcnJvciwgY29sbGVjdEVycm9yVm5vZGUsIGdldFJldHVybiwgcnVuRXhjZXB0aW9uLCBnbG9iYWxFcnJvcn0gZnJvbSAnLi9lcnJvckJvdW5kYXJ5JztcblxuXG4vL1RvcCBBcGlcbmZ1bmN0aW9uIGNyZWF0ZVBvcnRhbChjaGlsZHJlbiwgY29udGFpbmVyKSB7XG4gICAgbGV0IGRvbU5vZGU7XG4gICAgaWYgKGNvbnRhaW5lcikge1xuICAgICAgICBpZiAoQXJyYXkuaXNBcnJheShjaGlsZHJlbikpIHtcbiAgICAgICAgICAgIGRvbU5vZGUgPSBtb3VudENoaWxkKGNoaWxkcmVuLCBjb250YWluZXIpXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBkb21Ob2RlID0gcmVuZGVyKGNoaWxkcmVuLCBjb250YWluZXIpO1xuICAgICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCfor7fnu5lwb3J0YWzkuIDkuKrmj5LlhaXnmoTnm67moIcnKVxuICAgIH1cbiAgICAvL+eUqOS6juiusOW9lVBvcnRhbOeahOS6i+eJqVxuICAgIC8vIGxldCBsYXN0T3duZXIgPSBjdXJyZW50T3duZXIuY3VyO1xuICAgIC8vIGN1cnJlbnRPd25lci5jdXIgPSBpbnN0YW5jZTtcblxuXG4gICAgY29uc3QgQ3JlYXRlUG9ydGFsVm5vZGUgPSBuZXcgVm5vZGVDbGFzcygnI3RleHQnLCBcImNyZWF0ZVBvcnRhbFwiLCBudWxsLCBudWxsKVxuICAgIENyZWF0ZVBvcnRhbFZub2RlLl9Qb3J0YWxIb3N0Tm9kZSA9IGNvbnRhaW5lclxuICAgIHJldHVybiBDcmVhdGVQb3J0YWxWbm9kZVxufVxuXG5sZXQgbW91bnRJbmRleCA9IDAgLy/lhajlsYDlj5jph49cbnZhciBjb250YWluZXJNYXAgPSB7fVxuXG52YXIgY3VycmVudE93bmVyID0ge1xuICAgIGN1cjogbnVsbFxufTtcblxuZnVuY3Rpb24gaW5zdGFuY2VQcm9wcyhjb21wb25lbnRWbm9kZSkge1xuICAgIHJldHVybiB7XG4gICAgICAgIG9sZFN0YXRlOiBjb21wb25lbnRWbm9kZS5faW5zdGFuY2Uuc3RhdGUsXG4gICAgICAgIG9sZFByb3BzOiBjb21wb25lbnRWbm9kZS5faW5zdGFuY2UucHJvcHMsXG4gICAgICAgIG9sZENvbnRleHQ6IGNvbXBvbmVudFZub2RlLl9pbnN0YW5jZS5jb250ZXh0LFxuICAgICAgICBvbGRWbm9kZTogY29tcG9uZW50Vm5vZGUuX2luc3RhbmNlLlZub2RlXG4gICAgfVxufVxuXG5mdW5jdGlvbiBtb3VudEluZGV4QWRkKCkge1xuICAgIHJldHVybiBtb3VudEluZGV4Kytcbn1cblxuZnVuY3Rpb24gdXBkYXRlVGV4dChvbGRUZXh0Vm5vZGUsIG5ld1RleHRWbm9kZSwgcGFyZW50RG9tTm9kZTogRWxlbWVudCkge1xuICAgIGxldCBkb206IEVsZW1lbnQgPSBvbGRUZXh0Vm5vZGUuX2hvc3ROb2RlXG4gICAgaWYgKG9sZFRleHRWbm9kZS5wcm9wcyAhPT0gbmV3VGV4dFZub2RlLnByb3BzKSB7XG4gICAgICAgIGRvbS5ub2RlVmFsdWUgPSBuZXdUZXh0Vm5vZGUucHJvcHNcbiAgICB9XG59XG5cbmZ1bmN0aW9uIHVwZGF0ZUNoaWxkKG9sZENoaWxkLCBuZXdDaGlsZCwgcGFyZW50RG9tTm9kZTogRWxlbWVudCwgcGFyZW50Q29udGV4dCkge1xuICAgIG5ld0NoaWxkID0gZmxhdHRlbkNoaWxkcmVuKG5ld0NoaWxkKVxuICAgIG9sZENoaWxkID0gb2xkQ2hpbGQgfHwgW11cbiAgICBpZiAoIUFycmF5LmlzQXJyYXkob2xkQ2hpbGQpKSBvbGRDaGlsZCA9IFtvbGRDaGlsZF1cbiAgICBpZiAoIUFycmF5LmlzQXJyYXkobmV3Q2hpbGQpKSBuZXdDaGlsZCA9IFtuZXdDaGlsZF1cblxuICAgIGxldCBvbGRMZW5ndGggPSBvbGRDaGlsZC5sZW5ndGgsXG4gICAgICAgIG5ld0xlbmd0aCA9IG5ld0NoaWxkLmxlbmd0aCxcbiAgICAgICAgb2xkU3RhcnRJbmRleCA9IDAsIG5ld1N0YXJ0SW5kZXggPSAwLFxuICAgICAgICBvbGRFbmRJbmRleCA9IG9sZExlbmd0aCAtIDEsXG4gICAgICAgIG5ld0VuZEluZGV4ID0gbmV3TGVuZ3RoIC0gMSxcbiAgICAgICAgb2xkU3RhcnRWbm9kZSA9IG9sZENoaWxkWzBdLFxuICAgICAgICBuZXdTdGFydFZub2RlID0gbmV3Q2hpbGRbMF0sXG4gICAgICAgIG9sZEVuZFZub2RlID0gb2xkQ2hpbGRbb2xkRW5kSW5kZXhdLFxuICAgICAgICBuZXdFbmRWbm9kZSA9IG5ld0NoaWxkW25ld0VuZEluZGV4XSxcbiAgICAgICAgaGFzY29kZSA9IHt9O1xuXG4gICAgaWYgKG5ld0xlbmd0aCA+PSAwICYmICFvbGRMZW5ndGgpIHtcbiAgICAgICAgbmV3Q2hpbGQuZm9yRWFjaCgobmV3Vm5vZGUsIGluZGV4KSA9PiB7XG4gICAgICAgICAgICByZW5kZXJCeUx1eShuZXdWbm9kZSwgcGFyZW50RG9tTm9kZSwgZmFsc2UsIHBhcmVudENvbnRleHQpXG4gICAgICAgICAgICBuZXdDaGlsZFtpbmRleF0gPSBuZXdWbm9kZVxuICAgICAgICB9KVxuICAgICAgICByZXR1cm4gbmV3Q2hpbGRcbiAgICB9XG4gICAgaWYgKCFuZXdMZW5ndGggJiYgb2xkTGVuZ3RoID49IDApIHtcbiAgICAgICAgb2xkQ2hpbGQuZm9yRWFjaCgob2xkVm5vZGUpID0+IHtcbiAgICAgICAgICAgIGRpc3Bvc2VWbm9kZShvbGRWbm9kZSlcbiAgICAgICAgfSlcbiAgICAgICAgcmV0dXJuIG5ld0NoaWxkWzBdXG4gICAgfVxuXG4gICAgd2hpbGUgKG9sZFN0YXJ0SW5kZXggPD0gb2xkRW5kSW5kZXggJiYgbmV3U3RhcnRJbmRleCA8PSBuZXdFbmRJbmRleCkge1xuICAgICAgICBpZiAob2xkU3RhcnRWbm9kZSA9PT0gdW5kZWZpbmVkIHx8IG9sZFN0YXJ0Vm5vZGUgPT09IG51bGwpIHtcbiAgICAgICAgICAgIG9sZFN0YXJ0Vm5vZGUgPSBvbGRDaGlsZFsrK29sZFN0YXJ0SW5kZXhdO1xuICAgICAgICB9IGVsc2UgaWYgKG9sZEVuZFZub2RlID09PSB1bmRlZmluZWQgfHwgb2xkRW5kVm5vZGUgPT09IG51bGwpIHtcbiAgICAgICAgICAgIG9sZEVuZFZub2RlID0gb2xkQ2hpbGRbLS1vbGRFbmRJbmRleF07XG4gICAgICAgIH0gZWxzZSBpZiAobmV3U3RhcnRWbm9kZSA9PT0gdW5kZWZpbmVkIHx8IG5ld1N0YXJ0Vm5vZGUgPT09IG51bGwpIHtcbiAgICAgICAgICAgIG5ld1N0YXJ0Vm5vZGUgPSBuZXdDaGlsZFsrK25ld1N0YXJ0SW5kZXhdO1xuICAgICAgICB9IGVsc2UgaWYgKG5ld0VuZFZub2RlID09PSB1bmRlZmluZWQgfHwgbmV3RW5kVm5vZGUgPT09IG51bGwpIHtcbiAgICAgICAgICAgIG5ld0VuZFZub2RlID0gbmV3Q2hpbGRbLS1uZXdFbmRJbmRleF07XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoaXNTYW1lVm5vZGUob2xkU3RhcnRWbm9kZSwgbmV3U3RhcnRWbm9kZSkpIHtcbiAgICAgICAgICAgIHVwZGF0ZShvbGRTdGFydFZub2RlLCBuZXdTdGFydFZub2RlLCBuZXdTdGFydFZub2RlLl9ob3N0Tm9kZSwgcGFyZW50Q29udGV4dClcbiAgICAgICAgICAgIG9sZFN0YXJ0Vm5vZGUgPSBvbGRDaGlsZFsrK29sZFN0YXJ0SW5kZXhdXG4gICAgICAgICAgICBuZXdTdGFydFZub2RlID0gbmV3Q2hpbGRbKytuZXdTdGFydEluZGV4XVxuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKGlzU2FtZVZub2RlKG9sZEVuZFZub2RlLCBuZXdFbmRWbm9kZSkpIHtcbiAgICAgICAgICAgIHVwZGF0ZShvbGRFbmRWbm9kZSwgbmV3RW5kVm5vZGUsIG5ld0VuZFZub2RlLl9ob3N0Tm9kZSwgcGFyZW50Q29udGV4dClcbiAgICAgICAgICAgIG9sZEVuZFZub2RlID0gb2xkQ2hpbGRbLS1vbGRFbmRJbmRleF1cbiAgICAgICAgICAgIG5ld0VuZFZub2RlID0gbmV3Q2hpbGRbLS1uZXdFbmRJbmRleF1cbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChpc1NhbWVWbm9kZShvbGRTdGFydFZub2RlLCBuZXdFbmRWbm9kZSkpIHtcbiAgICAgICAgICAgIGxldCBkb20gPSBvbGRTdGFydFZub2RlLl9ob3N0Tm9kZVxuICAgICAgICAgICAgcGFyZW50RG9tTm9kZS5pbnNlcnRCZWZvcmUoZG9tLCBvbGRFbmRWbm9kZS5uZXh0U2libGluZylcbiAgICAgICAgICAgIHVwZGF0ZShvbGRTdGFydFZub2RlLCBuZXdFbmRWbm9kZSwgb2xkU3RhcnRWbm9kZS5faG9zdE5vZGUuX2hvc3ROb2RlLCBwYXJlbnRDb250ZXh0KVxuICAgICAgICAgICAgb2xkU3RhcnRWbm9kZSA9IG9sZENoaWxkWysrb2xkU3RhcnRJbmRleF1cbiAgICAgICAgICAgIG5ld0VuZFZub2RlID0gbmV3Q2hpbGRbLS1uZXdFbmRJbmRleF1cbiAgICAgICAgfSBlbHNlIGlmIChpc1NhbWVWbm9kZShvbGRFbmRWbm9kZSwgbmV3U3RhcnRWbm9kZSkpIHtcbiAgICAgICAgICAgIGxldCBkb20gPSBvbGRFbmRWbm9kZS5faG9zdE5vZGVcbiAgICAgICAgICAgIHBhcmVudERvbU5vZGUuaW5zZXJ0QmVmb3JlKGRvbSwgb2xkU3RhcnRWbm9kZS5faG9zdE5vZGUpXG4gICAgICAgICAgICB1cGRhdGUob2xkU3RhcnRWbm9kZSwgbmV3RW5kVm5vZGUsIG9sZFN0YXJ0Vm5vZGUuX2hvc3ROb2RlLCBwYXJlbnRDb250ZXh0KVxuICAgICAgICAgICAgb2xkRW5kVm5vZGUgPSBvbGRDaGlsZFstLW9sZEVuZEluZGV4XVxuICAgICAgICAgICAgbmV3U3RhcnRWbm9kZSA9IG5ld0NoaWxkWysrbmV3U3RhcnRJbmRleF1cbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGlmIChoYXNjb2RlID09PSB1bmRlZmluZWQpIGhhc2NvZGUgPSBtYXBLZXlUb0luZGV4KG9sZENoaWxkKVxuXG4gICAgICAgICAgICBsZXQgaW5kZXhJbk9sZCA9IGhhc2NvZGVbbmV3U3RhcnRWbm9kZS5rZXldXG5cbiAgICAgICAgICAgIGlmIChpbmRleEluT2xkID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICBpZiAobmV3U3RhcnRWbm9kZS50eXBlID09PSAnI3RleHQnKSB7XG4gICAgICAgICAgICAgICAgICAgIHVwZGF0ZShvbGRTdGFydFZub2RlLCBuZXdTdGFydFZub2RlLCBwYXJlbnREb21Ob2RlLCBwYXJlbnRDb250ZXh0KTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBsZXQgX3BhcmVudERvbU5vZGUgPSBwYXJlbnREb21Ob2RlO1xuICAgICAgICAgICAgICAgICAgICBpZiAocGFyZW50RG9tTm9kZS5ub2RlTmFtZSA9PT0gJyN0ZXh0Jykge1xuICAgICAgICAgICAgICAgICAgICAgICAgX3BhcmVudERvbU5vZGUgPSBwYXJlbnREb21Ob2RlLnBhcmVudE5vZGU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKG9sZFN0YXJ0Vm5vZGUudHlwZSA9PT0gJyN0ZXh0Jykge1xuICAgICAgICAgICAgICAgICAgICAgICAgX3BhcmVudERvbU5vZGUgPSBwYXJlbnREb21Ob2RlLnBhcmVudE5vZGU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgbGV0IG5ld0VsbSA9IHJlbmRlckJ5THV5KG5ld1N0YXJ0Vm5vZGUsIF9wYXJlbnREb21Ob2RlLCB0cnVlLCBwYXJlbnRDb250ZXh0KVxuICAgICAgICAgICAgICAgICAgICBfcGFyZW50RG9tTm9kZS5pbnNlcnRCZWZvcmUobmV3RWxtLCBvbGRTdGFydFZub2RlLl9ob3N0Tm9kZSlcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBuZXdTdGFydFZub2RlID0gbmV3Q2hpbGRbKytuZXdTdGFydEluZGV4XVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBsZXQgbW92ZVZub2RlID0gb2xkQ2hpbGRbaW5kZXhJbk9sZF1cbiAgICAgICAgICAgICAgICB1cGRhdGUobW92ZVZub2RlLCBuZXdTdGFydFZub2RlLCBtb3ZlVm5vZGUuX2hvc3ROb2RlLCBwYXJlbnRDb250ZXh0KVxuICAgICAgICAgICAgICAgIHBhcmVudERvbU5vZGUuaW5zZXJ0QmVmb3JlKG1vdmVWbm9kZS5faG9zdE5vZGUsIG9sZFN0YXJ0Vm5vZGUuX2hvc3ROb2RlKVxuICAgICAgICAgICAgICAgIG9sZENoaWxkW2luZGV4SW5PbGRdID0gdW5kZWZpbmVkXG4gICAgICAgICAgICAgICAgbmV3U3RhcnRWbm9kZSA9IG5ld0NoaWxkWysrbmV3U3RhcnRJbmRleF1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAob2xkU3RhcnRJbmRleCA+IG9sZEVuZEluZGV4KSB7XG5cbiAgICAgICAgICAgIGZvciAoOyBuZXdTdGFydEluZGV4IC0gMSA8IG5ld0VuZEluZGV4OyBuZXdTdGFydEluZGV4KyspIHtcbiAgICAgICAgICAgICAgICBpZiAobmV3Q2hpbGRbbmV3U3RhcnRJbmRleF0pIHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IG5ld0RvbU5vZGUgPSByZW5kZXJCeUx1eShuZXdDaGlsZFtuZXdTdGFydEluZGV4XSwgcGFyZW50RG9tTm9kZSwgdHJ1ZSwgcGFyZW50Q29udGV4dClcbiAgICAgICAgICAgICAgICAgICAgcGFyZW50RG9tTm9kZS5hcHBlbmRDaGlsZChuZXdEb21Ob2RlKVxuICAgICAgICAgICAgICAgICAgICAvLyBpZiAob2xkQ2hpbGRbb2xkQ2hpbGQubGVuZ3RoIC0gMV0pIHtcblxuICAgICAgICAgICAgICAgICAgICAvLyB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAvLyAgICAgcGFyZW50RG9tTm9kZS5pbnNlcnRCZWZvcmUobmV3RG9tTm9kZSwgb2xkQ2hpbGRbb2xkQ2hpbGQubGVuZ3RoIC0gMV0uX2hvc3ROb2RlKVxuICAgICAgICAgICAgICAgICAgICAvLyB9XG4gICAgICAgICAgICAgICAgICAgIG5ld0NoaWxkW25ld1N0YXJ0SW5kZXhdLl9ob3N0Tm9kZSA9IG5ld0RvbU5vZGVcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfSBlbHNlIGlmIChuZXdTdGFydEluZGV4ID4gbmV3RW5kSW5kZXgpIHtcbiAgICAgICAgICAgIGZvciAoOyBvbGRTdGFydEluZGV4IC0gMSA8IG9sZEVuZEluZGV4OyBvbGRTdGFydEluZGV4KyspIHtcbiAgICAgICAgICAgICAgICBpZiAob2xkQ2hpbGRbb2xkU3RhcnRJbmRleF0pIHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IHJlbW92ZU5vZGUgPSBvbGRDaGlsZFtvbGRTdGFydEluZGV4XVxuICAgICAgICAgICAgICAgICAgICBpZiAodHlwZU51bWJlcihyZW1vdmVOb2RlLl9ob3N0Tm9kZSkgPD0gMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy/or4HmmI7ov5nkuKroioLngrnlt7Lnu4/ooqvnp7vpmaTvvJtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZGlzcG9zZVZub2RlKHJlbW92ZU5vZGUpXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiBuZXdDaGlsZFxufVxuXG5cbi8qKlxuICog5b2T5oiR5Lus5pu05paw57uE5Lu255qE5pe25YCZ77yM5bm25LiN6ZyA6KaB6YeN5paw5Yib5bu65LiA5Liq57uE5Lu277yM6ICM5piv5ou/5Yiw5LmF55qE57uE5Lu255qEcHJvcHMsc3RhdGUsY29udGV4dOWwseWPr+S7pei/m+ihjOmHjeaWsHJlbmRlclxuICog6ICM5LiU6KaB5rOo5oSP55qE5piv77yM57uE5Lu255qE5pu05paw5bm25LiN6ZyA6KaB5q+U5a+55oiW6ICF5Lqk5o2ic3RhdGUs5Zug5Li657uE5Lu255qE5pu05paw5a6M5YWo5L6d6Z2g5aSW6YOo55qEY29udGV4dOWSjHByb3BzXG4gKiBAcGFyYW0geyp9IG9sZENvbXBvbmVudFZub2RlIOiAgeeahOWtqeWtkOe7hOS7tu+8jF9pbnN0YW5jZemHjOmdouacieedgOi/meS4que7hOS7tueahOWunuS+i1xuICogQHBhcmFtIHsqfSBuZXdDb21wb25lbnRWbm9kZSDmlrDnmoTnu4Tku7ZcbiAqIEBwYXJhbSB7Kn0gcGFyZW50Q29udGV4dCDniLbkurJjb250ZXh0XG4gKiBAcGFyYW0geyp9IHBhcmVudERvbU5vZGUg54i25Lqy6IqC54K5XG4gKi9cbmZ1bmN0aW9uIHVwZGF0ZUNvbXBvbmVudChvbGRDb21wb25lbnRWbm9kZSwgbmV3Q29tcG9uZW50Vm5vZGUsIHBhcmVudENvbnRleHQsIHBhcmVudERvbU5vZGUpIHtcbiAgICBjb25zdCB7XG4gICAgICAgIG9sZFN0YXRlLFxuICAgICAgICBvbGRQcm9wcyxcbiAgICAgICAgb2xkQ29udGV4dCxcbiAgICAgICAgb2xkVm5vZGVcbiAgICB9ID0gaW5zdGFuY2VQcm9wcyhvbGRDb21wb25lbnRWbm9kZSlcblxuICAgIGNvbnN0IG5ld1Byb3BzID0gbmV3Q29tcG9uZW50Vm5vZGUucHJvcHNcbiAgICBsZXQgbmV3Q29udGV4dCA9IHBhcmVudENvbnRleHRcbiAgICBjb25zdCBpbnN0YW5jZSA9IG9sZENvbXBvbmVudFZub2RlLl9pbnN0YW5jZVxuICAgIC8vIGNvbnN0IHdpbGxSZWNlaXZlID0gb2xkQ29udGV4dCAhPT0gbmV3Q29udGV4dCB8fCBvbGRQcm9wcyAhPT0gbmV3UHJvcHNcbiAgICAvL+WmguaenHByb3Bz5ZKMY29udGV4dOS4reeahOS7u+aEj+S4gOS4quaUueWPmOS6hu+8jOmCo+S5iOWwseS8muinpuWPkee7hOS7tueahHJlY2VpdmUscmVuZGVyLHVwZGF0ZeetiVxuICAgIC8v5L2G5piv5L6d5pen5Lya57un57ut5b6A5LiL5q+U6L6DXG5cbiAgICAvL+abtOaWsOWOn+adpee7hOS7tueahOS/oeaBr1xuICAgIG9sZENvbXBvbmVudFZub2RlLl9pbnN0YW5jZS5wcm9wcyA9IG5ld1Byb3BzXG5cbiAgICBpZiAoaW5zdGFuY2UuZ2V0Q2hpbGRDb250ZXh0KSB7XG4gICAgICAgIG9sZENvbXBvbmVudFZub2RlLl9pbnN0YW5jZS5jb250ZXh0ID0gZXh0ZW5kKGV4dGVuZCh7fSwgbmV3Q29udGV4dCksIGluc3RhbmNlLmdldENoaWxkQ29udGV4dCgpKVxuICAgIH0gZWxzZSB7XG4gICAgICAgIG9sZENvbXBvbmVudFZub2RlLl9pbnN0YW5jZS5jb250ZXh0ID0gZXh0ZW5kKHt9LCBuZXdDb250ZXh0KVxuICAgIH1cblxuICAgIG9sZENvbXBvbmVudFZub2RlLl9pbnN0YW5jZS5saWZlQ3ljbGUgPSBDb20uVVBEQVRJTkdcbiAgICBpZiAob2xkQ29tcG9uZW50Vm5vZGUuX2luc3RhbmNlLmNvbXBvbmVudFdpbGxSZWNlaXZlUHJvcHMpIHtcbiAgICAgICAgY2F0Y2hFcnJvcihvbGRDb21wb25lbnRWbm9kZS5faW5zdGFuY2UsICdjb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzJywgW25ld1Byb3BzLCBuZXdDb250ZXh0XSk7XG4gICAgICAgIGxldCBtZXJnZWRTdGF0ZSA9IG9sZENvbXBvbmVudFZub2RlLl9pbnN0YW5jZS5zdGF0ZTtcbiAgICAgICAgb2xkQ29tcG9uZW50Vm5vZGUuX2luc3RhbmNlLl9wZW5kZGluZ1N0YXRlLmZvckVhY2goKHBhcnRpYWxTdGF0ZSkgPT4ge1xuICAgICAgICAgICAgbWVyZ2VkU3RhdGUgPSBleHRlbmQoZXh0ZW5kKHt9LCBtZXJnZWRTdGF0ZSksIHBhcnRpYWxTdGF0ZS5wYXJ0aWFsTmV3U3RhdGUpXG4gICAgICAgIH0pXG4gICAgICAgIG9sZENvbXBvbmVudFZub2RlLl9pbnN0YW5jZS5zdGF0ZSA9IG1lcmdlZFN0YXRlXG4gICAgfVxuXG4gICAgaWYgKG9sZENvbXBvbmVudFZub2RlLl9pbnN0YW5jZS5zaG91bGRDb21wb25lbnRVcGRhdGUpIHtcbiAgICAgICAgbGV0IHNob3VsZFVwZGF0ZSA9IGNhdGNoRXJyb3Iob2xkQ29tcG9uZW50Vm5vZGUuX2luc3RhbmNlLCAnc2hvdWxkQ29tcG9uZW50VXBkYXRlJywgW25ld1Byb3BzLCBvbGRTdGF0ZSwgbmV3Q29udGV4dF0pO1xuICAgICAgICBpZiAoIXNob3VsZFVwZGF0ZSkge1xuICAgICAgICAgICAgLy/ml6DorrpzaG91bGRDb21wb25lbnRVcGRhdGXnu5PmnpzmmK/lpoLkvZXvvIzmlbDmja7pg73kvJrnu5nnlKjmiLforr7nva7kuIrljrtcbiAgICAgICAgICAgIC8v5L2G5piv5LiN5LiA5a6a5Lya5Yi35pawXG4gICAgICAgICAgICBvbGRDb21wb25lbnRWbm9kZS5faW5zdGFuY2UucHJvcHMgPSBuZXdQcm9wc1xuICAgICAgICAgICAgb2xkQ29tcG9uZW50Vm5vZGUuX2luc3RhbmNlLmNvbnRleHQgPSBuZXdDb250ZXh0XG4gICAgICAgICAgICByZXR1cm5cbiAgICAgICAgfVxuICAgIH1cblxuICAgIGlmIChvbGRDb21wb25lbnRWbm9kZS5faW5zdGFuY2UuY29tcG9uZW50V2lsbFVwZGF0ZSkge1xuICAgICAgICBjYXRjaEVycm9yKG9sZENvbXBvbmVudFZub2RlLl9pbnN0YW5jZSwgJ2NvbXBvbmVudFdpbGxVcGRhdGUnLCBbbmV3UHJvcHMsIG9sZFN0YXRlLCBuZXdDb250ZXh0XSlcbiAgICB9XG5cbiAgICBsZXQgbGFzdE93bmVyID0gY3VycmVudE93bmVyLmN1clxuICAgIGN1cnJlbnRPd25lci5jdXIgPSBvbGRDb21wb25lbnRWbm9kZS5faW5zdGFuY2VcblxuICAgIGxldCBuZXdWbm9kZSA9IG9sZENvbXBvbmVudFZub2RlLl9pbnN0YW5jZS5yZW5kZXIgPyBjYXRjaEVycm9yKG9sZENvbXBvbmVudFZub2RlLl9pbnN0YW5jZSwgJ3JlbmRlcicsIFtdKSA6IG5ldyBuZXdDb21wb25lbnRWbm9kZS50eXBlKG5ld1Byb3BzLCBuZXdDb250ZXh0KVxuICAgIG5ld1Zub2RlID0gbmV3Vm5vZGUgPyBuZXdWbm9kZSA6IG5ldyBWbm9kZUNsYXNzKCcjdGV4dCcsIFwiXCIsIG51bGwsIG51bGwpLy/nlKjmiLfmnInlj6/og73ov5Tlm55udWxs77yM5b2T6L+U5ZuebnVsbOeahOaXtuWAmeS9v+eUqOS4gOS4quepuueZvWRvbeS7o+abv1xuICAgIGNvbnN0IHJlbmRlcmVkVHlwZSA9IHR5cGVOdW1iZXIobmV3Vm5vZGUpO1xuICAgIGlmIChyZW5kZXJlZFR5cGUgPT09IDMgJiYgcmVuZGVyZWRUeXBlID09PSA0KSB7XG4gICAgICAgIHJlbmRlcmVkVm5vZGUgPSBuZXcgVm5vZGVDbGFzcygnI3RleHQnLCByZW5kZXJlZFZub2RlLCBudWxsLCBudWxsKTtcbiAgICB9XG4gICAgbGV0IGZpeGVkT2xkVm5vZGUgPSBvbGRWbm9kZSA/IG9sZFZub2RlIDogb2xkQ29tcG9uZW50Vm5vZGUuX2luc3RhbmNlXG5cbiAgICBjdXJyZW50T3duZXIuY3VyID0gbGFzdE93bmVyXG5cbiAgICBjb25zdCB3aWxsVXBkYXRlID0gb3B0aW9ucy5kaXJ0eUNvbXBvbmVudFtvbGRDb21wb25lbnRWbm9kZS5faW5zdGFuY2UuX3VuaXF1ZUlkXS8v5Zug5Li655SocmVhY3QtcmVkdXjmm7TmlrDnmoTml7blgJnvvIzkuI3nhLbkvJrph43lpI3mm7TmlrAuXG4gICAgaWYgKHdpbGxVcGRhdGUpIHtcbiAgICAgICAgLy/lpoLmnpzov5nkuKpjb21wb25lbnTmraPlpb3mmK/pnIDopoHmm7TmlrDnmoRjb21wb25lbnTvvIzpgqPkuYjliJnmm7TmlrDvvIznhLblkI7lsLHlsIbku5bku45tYXDkuK3liKDpmaRcbiAgICAgICAgLy/kuI3nhLbkvJrph43lpI3mm7TmlrBcbiAgICAgICAgZGVsZXRlIG9wdGlvbnMuZGlydHlDb21wb25lbnRbb2xkQ29tcG9uZW50Vm5vZGUuX2luc3RhbmNlLl91bmlxdWVJZF1cbiAgICB9XG5cbiAgICAvL+abtOaWsOecn+WunmRvbSzkv53lrZjmlrDnmoToioLngrlcblxuICAgIHVwZGF0ZShmaXhlZE9sZFZub2RlLCBuZXdWbm9kZSwgb2xkQ29tcG9uZW50Vm5vZGUuX2hvc3ROb2RlLCBpbnN0YW5jZS5jb250ZXh0KVxuICAgIG9sZENvbXBvbmVudFZub2RlLl9ob3N0Tm9kZSA9IG5ld1Zub2RlLl9ob3N0Tm9kZVxuICAgIGlmIChvbGRDb21wb25lbnRWbm9kZS5faW5zdGFuY2UuVm5vZGUpIHsvL+abtOaWsFJlYWN0IGNvbXBvbmVudOeahOaXtuWAmemcgOimgeeUqOaWsOeahOWujOWFqOabtOaWsOaXp+eahGNvbXBvbmVudO+8jOS4jeeEtuaXoOazleabtOaWsFxuICAgICAgICBvbGRDb21wb25lbnRWbm9kZS5faW5zdGFuY2UuVm5vZGUgPSBuZXdWbm9kZVxuICAgIH0gZWxzZSB7XG4gICAgICAgIG9sZENvbXBvbmVudFZub2RlLl9pbnN0YW5jZSA9IG5ld1Zub2RlXG4gICAgfVxuXG5cbiAgICBpZiAob2xkQ29tcG9uZW50Vm5vZGUuX2luc3RhbmNlKSB7XG4gICAgICAgIGlmIChvbGRDb21wb25lbnRWbm9kZS5faW5zdGFuY2UuY29tcG9uZW50RGlkVXBkYXRlKSB7XG4gICAgICAgICAgICBjYXRjaEVycm9yKG9sZENvbXBvbmVudFZub2RlLl9pbnN0YW5jZSwgJ2NvbXBvbmVudERpZFVwZGF0ZScsIFtvbGRQcm9wcywgb2xkU3RhdGUsIG9sZENvbnRleHRdKTtcbiAgICAgICAgfVxuICAgICAgICBvbGRDb21wb25lbnRWbm9kZS5faW5zdGFuY2UubGlmZUN5Y2xlID0gQ29tLlVQREFURURcbiAgICB9XG5cbn1cblxuXG5mdW5jdGlvbiB1cGRhdGUob2xkVm5vZGUsIG5ld1Zub2RlLCBwYXJlbnREb21Ob2RlOiBFbGVtZW50LCBwYXJlbnRDb250ZXh0KSB7XG4gICAgbmV3Vm5vZGUuX2hvc3ROb2RlID0gb2xkVm5vZGUuX2hvc3ROb2RlXG4gICAgaWYgKG9sZFZub2RlLnR5cGUgPT09IG5ld1Zub2RlLnR5cGUpIHtcbiAgICAgICAgaWYgKHR5cGVOdW1iZXIob2xkVm5vZGUpID09PSA3KSB7XG4gICAgICAgICAgICBuZXdWbm9kZSA9IHVwZGF0ZUNoaWxkKG9sZFZub2RlLCBuZXdWbm9kZSwgcGFyZW50RG9tTm9kZSwgcGFyZW50Q29udGV4dCk7XG5cbiAgICAgICAgICAgIG5ld1Zub2RlLnJldHVybiA9IG9sZFZub2RlLnJldHVybjtcbiAgICAgICAgICAgIG5ld1Zub2RlLl9ob3N0Tm9kZSA9IG5ld1Zub2RlWzBdLl9ob3N0Tm9kZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChvbGRWbm9kZS50eXBlID09PSBcIiN0ZXh0XCIpIHtcbiAgICAgICAgICAgIG5ld1Zub2RlLl9ob3N0Tm9kZSA9IG9sZFZub2RlLl9ob3N0Tm9kZSAvL+abtOaWsOS4gOS4qmRvbeiKgueCuVxuICAgICAgICAgICAgdXBkYXRlVGV4dChvbGRWbm9kZSwgbmV3Vm5vZGUpXG5cbiAgICAgICAgICAgIHJldHVybiBuZXdWbm9kZVxuICAgICAgICB9XG4gICAgICAgIGlmICh0eXBlb2Ygb2xkVm5vZGUudHlwZSA9PT0gJ3N0cmluZycpIHsvL+WOn+eUn2h0bWxcbiAgICAgICAgICAgIHVwZGF0ZVByb3BzKG9sZFZub2RlLnByb3BzLCBuZXdWbm9kZS5wcm9wcywgbmV3Vm5vZGUuX2hvc3ROb2RlKVxuICAgICAgICAgICAgaWYgKG9sZFZub2RlLnJlZiAhPT0gbmV3Vm5vZGUucmVmKSB7XG4gICAgICAgICAgICAgICAgLy8gaWYgKHR5cGVOdW1iZXIob2xkVm5vZGUucmVmKSA9PT0gNSkge1xuICAgICAgICAgICAgICAgIC8vICAgICBvbGRWbm9kZS5yZWYobnVsbClcbiAgICAgICAgICAgICAgICAvLyB9XG4gICAgICAgICAgICAgICAgc2V0UmVmKG5ld1Zub2RlLCBvbGRWbm9kZS5vd25lciwgbmV3Vm5vZGUuX2hvc3ROb2RlKVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvL+abtOaWsOWQjueahGNoaWxk77yM6L+U5Zue57uZ57uE5Lu2XG4gICAgICAgICAgICBuZXdWbm9kZS5wcm9wcy5jaGlsZHJlbiA9IHVwZGF0ZUNoaWxkKFxuICAgICAgICAgICAgICAgIG9sZFZub2RlLnByb3BzLmNoaWxkcmVuLFxuICAgICAgICAgICAgICAgIG5ld1Zub2RlLnByb3BzLmNoaWxkcmVuLFxuICAgICAgICAgICAgICAgIG9sZFZub2RlLl9ob3N0Tm9kZSxcbiAgICAgICAgICAgICAgICBwYXJlbnRDb250ZXh0KVxuICAgICAgICB9XG4gICAgICAgIGlmICh0eXBlb2Ygb2xkVm5vZGUudHlwZSA9PT0gJ2Z1bmN0aW9uJykgey8v6Z2e5Y6f55SfXG4gICAgICAgICAgICBpZiAoIW9sZFZub2RlLl9pbnN0YW5jZS5yZW5kZXIpIHtcbiAgICAgICAgICAgICAgICBjb25zdCB7cHJvcHN9ID0gbmV3Vm5vZGVcbiAgICAgICAgICAgICAgICBjb25zdCBuZXdTdGF0ZUxlc3NJbnN0YW5jZSA9IG5ldyBuZXdWbm9kZS50eXBlKHByb3BzLCBwYXJlbnRDb250ZXh0KVxuICAgICAgICAgICAgICAgIHVwZGF0ZShvbGRWbm9kZS5faW5zdGFuY2UsIG5ld1N0YXRlTGVzc0luc3RhbmNlLCBwYXJlbnREb21Ob2RlLCBwYXJlbnRDb250ZXh0KVxuICAgICAgICAgICAgICAgIG5ld1N0YXRlTGVzc0luc3RhbmNlLm93bmVyID0gb2xkVm5vZGUuX2luc3RhbmNlLm93bmVyXG4gICAgICAgICAgICAgICAgbmV3U3RhdGVMZXNzSW5zdGFuY2UucmVmID0gb2xkVm5vZGUuX2luc3RhbmNlLnJlZlxuICAgICAgICAgICAgICAgIG5ld1N0YXRlTGVzc0luc3RhbmNlLmtleSA9IG9sZFZub2RlLl9pbnN0YW5jZS5rZXlcbiAgICAgICAgICAgICAgICBuZXdWbm9kZS5faW5zdGFuY2UgPSBuZXdTdGF0ZUxlc3NJbnN0YW5jZVxuICAgICAgICAgICAgICAgIHJldHVybiBuZXdWbm9kZVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB1cGRhdGVDb21wb25lbnQob2xkVm5vZGUsIG5ld1Zub2RlLCBwYXJlbnRDb250ZXh0LCBwYXJlbnREb21Ob2RlKVxuICAgICAgICAgICAgbmV3Vm5vZGUub3duZXIgPSBvbGRWbm9kZS5vd25lcjtcbiAgICAgICAgICAgIG5ld1Zub2RlLnJlZiA9IG9sZFZub2RlLnJlZjtcbiAgICAgICAgICAgIG5ld1Zub2RlLmtleSA9IG9sZFZub2RlLmtleTtcbiAgICAgICAgICAgIG5ld1Zub2RlLl9pbnN0YW5jZSA9IG9sZFZub2RlLl9pbnN0YW5jZTtcbiAgICAgICAgICAgIG5ld1Zub2RlLl9Qb3J0YWxIb3N0Tm9kZSA9IG9sZFZub2RlLl9Qb3J0YWxIb3N0Tm9kZSA/IG9sZFZub2RlLl9Qb3J0YWxIb3N0Tm9kZSA6IHZvaWQgNjY2O1xuICAgICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKHR5cGVOdW1iZXIobmV3Vm5vZGUpID09PSA3KSB7XG4gICAgICAgICAgICBuZXdWbm9kZS5mb3JFYWNoKChuZXd2bm9kZSwgaW5kZXgpID0+IHtcblxuICAgICAgICAgICAgICAgIGxldCBkb20gPSByZW5kZXJCeUx1eShuZXd2bm9kZSwgcGFyZW50RG9tTm9kZSwgdHJ1ZSwgcGFyZW50Q29udGV4dClcbiAgICAgICAgICAgICAgICBpZiAoaW5kZXggPT09IDApIG5ld1Zub2RlLl9ob3N0Tm9kZSA9IGRvbTtcbiAgICAgICAgICAgICAgICBjb25zdCBwYXJlbnROb2RlID0gcGFyZW50RG9tTm9kZS5wYXJlbnROb2RlXG4gICAgICAgICAgICAgICAgaWYgKG5ld3Zub2RlLl9ob3N0Tm9kZSkge1xuICAgICAgICAgICAgICAgICAgICBwYXJlbnROb2RlLmluc2VydEJlZm9yZShkb20sIG9sZFZub2RlLl9ob3N0Tm9kZSlcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBwYXJlbnROb2RlLmFwcGVuZENoaWxkKGRvbSlcbiAgICAgICAgICAgICAgICAgICAgbmV3dm5vZGUuX2hvc3ROb2RlID0gZG9tXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIGRpc3Bvc2VWbm9kZShvbGRWbm9kZSlcbiAgICAgICAgICAgIHJldHVybiBuZXdWbm9kZVxuICAgICAgICB9XG4gICAgICAgIGNvbnN0IGRvbSA9IHJlbmRlckJ5THV5KG5ld1Zub2RlLCBwYXJlbnREb21Ob2RlLCB0cnVlLCBwYXJlbnRDb250ZXh0KVxuICAgICAgICBpZiAodHlwZU51bWJlcihuZXdWbm9kZS50eXBlKSAhPT0gNSkge1xuICAgICAgICAgICAgLy8gZGlzcG9zZVZub2RlKG9sZFZub2RlKTtcbiAgICAgICAgICAgIG5ld1Zub2RlLl9ob3N0Tm9kZSA9IGRvbVxuXG4gICAgICAgICAgICAvLyBjb25zdCBwYXJlbnROb2RlID0gcGFyZW50RG9tTm9kZS5wYXJlbnROb2RlXG4gICAgICAgICAgICBpZiAob2xkVm5vZGUuX2hvc3ROb2RlKSB7XG4gICAgICAgICAgICAgICAgcGFyZW50RG9tTm9kZS5pbnNlcnRCZWZvcmUoZG9tLCBvbGRWbm9kZS5faG9zdE5vZGUpXG4gICAgICAgICAgICAgICAgZGlzcG9zZVZub2RlKG9sZFZub2RlKVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBwYXJlbnREb21Ob2RlLmFwcGVuZENoaWxkKGRvbSlcblxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiBuZXdWbm9kZVxufVxuXG5cbi8qKlxuICog6YCS5b2S5riy5p+T6Jma5ouf57uE5Lu2XG4gKiBAcGFyYW0geyp9IFZub2RlXG4gKiBAcGFyYW0ge0VsZW1lbnR9IHBhcmVudERvbU5vZGVcbiAqL1xuZnVuY3Rpb24gbW91bnRDb21wb25lbnQoVm5vZGUsIHBhcmVudERvbU5vZGU6IEVsZW1lbnQsIHBhcmVudENvbnRleHQpIHtcbiAgICBjb25zdCB7dHlwZSwgcHJvcHMsIGtleSwgcmVmfSA9IFZub2RlXG5cbiAgICBjb25zdCBDb21wb25lbnQgPSB0eXBlXG4gICAgbGV0IGluc3RhbmNlID0gbmV3IENvbXBvbmVudChwcm9wcywgcGFyZW50Q29udGV4dClcbiAgICBWbm9kZS5faW5zdGFuY2UgPSBpbnN0YW5jZTsgLy8g5Zyo54i26IqC54K55LiK55qEY2hpbGTlhYPntKDkvJrkv53lrZjkuIDkuKroh6rlt7FcblxuICAgIGlmICghaW5zdGFuY2UucmVuZGVyKSB7XG4gICAgICAgIFZub2RlLl9pbnN0YW5jZSA9IGluc3RhbmNlOy8vZm9yIHJlYWN0LXJlZHV4LOi/memHjOaYr+a4suafk+aXoOeKtuaAgee7hOS7tlxuICAgICAgICByZXR1cm4gcmVuZGVyQnlMdXkoaW5zdGFuY2UsIHBhcmVudERvbU5vZGUsIGZhbHNlLCBwYXJlbnRDb250ZXh0KTtcbiAgICB9XG5cbiAgICBpZiAoaW5zdGFuY2UuZ2V0Q2hpbGRDb250ZXh0KSB7Ly/lpoLmnpznlKjmiLflrprkuYlnZXRDaGlsZENvbnRleHTvvIzpgqPkuYjnlKjlroPnlJ/miJDlrZBjb250ZXh0XG4gICAgICAgIGluc3RhbmNlLmNvbnRleHQgPSBleHRlbmQoZXh0ZW5kKHt9LCBpbnN0YW5jZS5jb250ZXh0KSwgaW5zdGFuY2UuZ2V0Q2hpbGRDb250ZXh0KCkpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIGluc3RhbmNlLmNvbnRleHQgPSBleHRlbmQoe30sIHBhcmVudENvbnRleHQpO1xuICAgIH1cblxuICAgIC8v55Sf5ZG95ZGo5pyf5Ye95pWwXG4gICAgaWYgKGluc3RhbmNlLmNvbXBvbmVudFdpbGxNb3VudCkge1xuICAgICAgICBjb25zdCBpc0NhdGNoZWQgPSBjYXRjaEVycm9yKGluc3RhbmNlLCAnY29tcG9uZW50V2lsbE1vdW50JywgW1Zub2RlXSk7XG4gICAgICAgIGlmIChpc0NhdGNoZWQpIHJldHVybjtcbiAgICB9XG5cbiAgICBsZXQgbGFzdE93bmVyID0gY3VycmVudE93bmVyLmN1cjtcbiAgICBjdXJyZW50T3duZXIuY3VyID0gaW5zdGFuY2U7XG4gICAgbGV0IHJlbmRlcmVkVm5vZGUgPSBjYXRjaEVycm9yKGluc3RhbmNlLCAncmVuZGVyJywgW1Zub2RlXSk7XG4gICAgY29uc3QgcmVuZGVyZWRUeXBlID0gdHlwZU51bWJlcihyZW5kZXJlZFZub2RlKTtcbiAgICBpZiAocmVuZGVyZWRUeXBlID09PSA3KSB7XG4gICAgICAgIHJlbmRlcmVkVm5vZGUgPSBtb3VudENoaWxkKHJlbmRlcmVkVm5vZGUsIHBhcmVudERvbU5vZGUsIHBhcmVudENvbnRleHQsIGluc3RhbmNlLCBWbm9kZSk7XG4gICAgfVxuICAgIGlmIChyZW5kZXJlZFR5cGUgPT09IDMgJiYgcmVuZGVyZWRUeXBlID09PSA0KSB7XG4gICAgICAgIHJlbmRlcmVkVm5vZGUgPSBuZXcgVm5vZGVDbGFzcygnI3RleHQnLCByZW5kZXJlZFZub2RlLCBudWxsLCBudWxsKTtcbiAgICB9XG4gICAgY3VycmVudE93bmVyLmN1ciA9IGxhc3RPd25lcjtcblxuICAgIGlmIChyZW5kZXJlZFZub2RlID09PSB2b2lkIDIzMykge1xuICAgICAgICAvLyBjb25zb2xlLndhcm4oJ+S9oOWPr+iDveW/mOiusOWcqOe7hOS7tnJlbmRlcigp5pa55rOV5Lit6L+U5ZueanN45LqGJyk7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgcmVuZGVyZWRWbm9kZSA9IHJlbmRlcmVkVm5vZGUgPyByZW5kZXJlZFZub2RlIDogbmV3IFZub2RlQ2xhc3MoJyN0ZXh0JywgXCJcIiwgbnVsbCwgbnVsbCk7XG5cblxuICAgIHJlbmRlcmVkVm5vZGUua2V5ID0ga2V5IHx8IG51bGw7XG4gICAgaW5zdGFuY2UuVm5vZGUgPSByZW5kZXJlZFZub2RlO1xuICAgIGluc3RhbmNlLlZub2RlLl9tb3VudEluZGV4ID0gbW91bnRJbmRleEFkZCgpO1xuXG5cbiAgICBWbm9kZS5kaXNwbGF5TmFtZSA9IENvbXBvbmVudC5uYW1lOy8v5Lul5LiL6L+Z5Lik6KGM55So5LqOY29tcG9uZW50RGlkY2F0Y2hcbiAgICBpbnN0YW5jZS5Wbm9kZS5yZXR1cm4gPSBWbm9kZTsvL+W/hemhu+imgeWcqOaPkuWFpeWJjeiuvue9rnJldHVybijniLZWbm9kZSnnu5nmiYDmnInnmoRWbm9kZS5cblxuICAgIHZhciBkb21Ob2RlID0gbnVsbDtcbiAgICBpZiAocmVuZGVyZWRUeXBlICE9PSA3KSB7XG4gICAgICAgIGRvbU5vZGUgPSByZW5kZXJCeUx1eShyZW5kZXJlZFZub2RlLCBwYXJlbnREb21Ob2RlLCBmYWxzZSwgaW5zdGFuY2UuY29udGV4dCwgaW5zdGFuY2UpO1xuICAgICAgICAvLyByZW5kZXJlZFZub2RlLmRpc3BsYXlOYW1lID0gQ29tcG9uZW50Lm5hbWU7Ly/orrDlvZXlkI3lrZdcbiAgICB9IGVsc2Uge1xuICAgICAgICBkb21Ob2RlID0gcmVuZGVyZWRWbm9kZVswXS5faG9zdE5vZGU7XG4gICAgfVxuXG4gICAgc2V0UmVmKFZub2RlLCBpbnN0YW5jZSwgZG9tTm9kZSk7XG5cbiAgICBWbm9kZS5faG9zdE5vZGUgPSBkb21Ob2RlO1xuICAgIGluc3RhbmNlLlZub2RlLl9ob3N0Tm9kZSA9IGRvbU5vZGU7Ly/nlKjkuo7lnKjmm7TmlrDml7bmnJ9vbGRWbm9kZeeahOaXtuWAmeiOt+WPll9ob3N0Tm9kZVxuXG4gICAgaWYgKHJlbmRlcmVkVm5vZGUuX1BvcnRhbEhvc3ROb2RlKSB7Ly/mlK/mjIFyZWFjdCBjcmVhdGVQb3J0YWxcbiAgICAgICAgVm5vZGUuX1BvcnRhbEhvc3ROb2RlID0gcmVuZGVyZWRWbm9kZS5fUG9ydGFsSG9zdE5vZGU7XG4gICAgICAgIHJlbmRlcmVkVm5vZGUuX1BvcnRhbEhvc3ROb2RlLl9Qb3J0YWxIb3N0Tm9kZSA9IGRvbU5vZGU7XG4gICAgfVxuXG4gICAgaWYgKGluc3RhbmNlLmNvbXBvbmVudERpZE1vdW50KSB7XG4gICAgICAgIC8vTW91dHRpbmflj5jph4/nlKjkuo7moIforrDnu4Tku7bmmK/lkKbmraPlnKjmjILovb1cbiAgICAgICAgLy/lpoLmnpzmraPlnKjmjILovb3vvIzliJnmiYDmnInnmoRzZXRTdGF0ZeWFqOmDqOmDveimgeWQiOW5tlxuICAgICAgICBpbnN0YW5jZS5saWZlQ3ljbGUgPSBDb20uTU9VTlRUSU5HO1xuICAgICAgICBjYXRjaEVycm9yKGluc3RhbmNlLCAnY29tcG9uZW50RGlkTW91bnQnLCBbXSk7XG4gICAgICAgIGluc3RhbmNlLmNvbXBvbmVudERpZE1vdW50ID0gbnVsbDsvL+mYsuatoueUqOaIt+iwg+eUqFxuICAgICAgICBpbnN0YW5jZS5saWZlQ3ljbGUgPSBDb20uTU9VTlQ7XG4gICAgfVxuXG4gICAgaWYgKGluc3RhbmNlLmNvbXBvbmVudERpZENhdGNoKSB7XG4gICAgICAgIC8vIHJ1bkV4Y2VwdGlvbigpO1xuICAgICAgICAvLyBpbnN0YW5jZS5jb21wb25lbnREaWRDYXRjaCgpO1xuICAgIH1cblxuICAgIGluc3RhbmNlLl91cGRhdGVJbkxpZmVDeWNsZSgpOyAvLyBjb21wb25lbnREaWRNb3VudOS5i+WQjuS4gOasoeaAp+abtOaWsFxuICAgIHJldHVybiBkb21Ob2RlXG59XG5cbmZ1bmN0aW9uIG1vdW50TmF0aXZlRWxlbWVudChWbm9kZSwgcGFyZW50RG9tTm9kZTogRWxlbWVudCwgaW5zdGFuY2UpIHtcbiAgICBjb25zdCBkb21Ob2RlID0gcmVuZGVyQnlMdXkoVm5vZGUsIHBhcmVudERvbU5vZGUsIGZhbHNlLCB7fSwgaW5zdGFuY2UpXG4gICAgVm5vZGUuX2hvc3ROb2RlID0gZG9tTm9kZVxuICAgIFZub2RlLl9tb3VudEluZGV4ID0gbW91bnRJbmRleEFkZCgpXG4gICAgcmV0dXJuIGRvbU5vZGVcbn1cblxuZnVuY3Rpb24gbW91bnRUZXh0Q29tcG9uZW50KFZub2RlLCBkb21Ob2RlOiBFbGVtZW50KSB7XG4gICAgbGV0IGZpeFRleHQgPSBWbm9kZS5wcm9wcyA9PT0gJ2NyZWF0ZVBvcnRhbCcgPyAnJyA6IFZub2RlLnByb3BzXG4gICAgbGV0IHRleHREb21Ob2RlID0gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoZml4VGV4dClcbiAgICBkb21Ob2RlLmFwcGVuZENoaWxkKHRleHREb21Ob2RlKVxuICAgIFZub2RlLl9ob3N0Tm9kZSA9IHRleHREb21Ob2RlXG4gICAgVm5vZGUuX21vdW50SW5kZXggPSBtb3VudEluZGV4QWRkKClcbiAgICByZXR1cm4gdGV4dERvbU5vZGVcbn1cblxuZnVuY3Rpb24gbW91bnRDaGlsZChjaGlsZHJlblZub2RlLCBwYXJlbnREb21Ob2RlOiBFbGVtZW50LCBwYXJlbnRDb250ZXh0LCBpbnN0YW5jZSwgcGFyZW50Vm5vZGUpIHtcblxuICAgIGxldCBjaGlsZFR5cGUgPSB0eXBlTnVtYmVyKGNoaWxkcmVuVm5vZGUpXG4gICAgbGV0IGZsYXR0ZW5DaGlsZExpc3QgPSBjaGlsZHJlblZub2RlO1xuXG4gICAgaWYgKGNoaWxkcmVuVm5vZGUgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICBmbGF0dGVuQ2hpbGRMaXN0ID0gZmxhdHRlbkNoaWxkcmVuKGNoaWxkcmVuVm5vZGUsIHBhcmVudFZub2RlKVxuICAgIH1cblxuICAgIGlmIChjaGlsZFR5cGUgPT09IDggJiYgY2hpbGRyZW5Wbm9kZSAhPT0gdW5kZWZpbmVkKSB7IC8vVm5vZGVcbiAgICAgICAgZmxhdHRlbkNoaWxkTGlzdCA9IGZsYXR0ZW5DaGlsZHJlbihjaGlsZHJlblZub2RlLCBwYXJlbnRWbm9kZSlcbiAgICAgICAgaWYgKHR5cGVOdW1iZXIoY2hpbGRyZW5Wbm9kZS50eXBlKSA9PT0gNSkge1xuICAgICAgICAgICAgZmxhdHRlbkNoaWxkTGlzdC5faG9zdE5vZGUgPSByZW5kZXJCeUx1eShmbGF0dGVuQ2hpbGRMaXN0LCBwYXJlbnREb21Ob2RlLCBmYWxzZSwgcGFyZW50Q29udGV4dCwgaW5zdGFuY2UpXG4gICAgICAgIH0gZWxzZSBpZiAodHlwZU51bWJlcihjaGlsZHJlblZub2RlLnR5cGUpID09PSAzIHx8IHR5cGVOdW1iZXIoY2hpbGRyZW5Wbm9kZS50eXBlKSA9PT0gNCkge1xuICAgICAgICAgICAgZmxhdHRlbkNoaWxkTGlzdC5faG9zdE5vZGUgPSBtb3VudE5hdGl2ZUVsZW1lbnQoZmxhdHRlbkNoaWxkTGlzdCwgcGFyZW50RG9tTm9kZSwgaW5zdGFuY2UpXG4gICAgICAgIH1cbiAgICB9XG4gICAgaWYgKGNoaWxkVHlwZSA9PT0gNykgey8vbGlzdFxuICAgICAgICBmbGF0dGVuQ2hpbGRMaXN0ID0gZmxhdHRlbkNoaWxkcmVuKGNoaWxkcmVuVm5vZGUsIHBhcmVudFZub2RlKVxuICAgICAgICBmbGF0dGVuQ2hpbGRMaXN0LmZvckVhY2goKGl0ZW0pID0+IHtcbiAgICAgICAgICAgIGlmIChpdGVtKSB7XG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBpdGVtLnR5cGUgPT09ICdmdW5jdGlvbicpIHsgLy/lpoLmnpzmmK/nu4Tku7blhYjkuI3muLLmn5PlrZDll6NcbiAgICAgICAgICAgICAgICAgICAgbW91bnRDb21wb25lbnQoaXRlbSwgcGFyZW50RG9tTm9kZSwgcGFyZW50Q29udGV4dClcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICByZW5kZXJCeUx1eShpdGVtLCBwYXJlbnREb21Ob2RlLCBmYWxzZSwgcGFyZW50Q29udGV4dCwgaW5zdGFuY2UpXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KVxuICAgIH1cbiAgICBpZiAoY2hpbGRUeXBlID09PSA0IHx8IGNoaWxkVHlwZSA9PT0gMykgey8vc3RyaW5nIG9yIG51bWJlclxuICAgICAgICBmbGF0dGVuQ2hpbGRMaXN0ID0gZmxhdHRlbkNoaWxkcmVuKGNoaWxkcmVuVm5vZGUsIHBhcmVudFZub2RlKTtcbiAgICAgICAgbW91bnRUZXh0Q29tcG9uZW50KGZsYXR0ZW5DaGlsZExpc3QsIHBhcmVudERvbU5vZGUpO1xuICAgIH1cbiAgICByZXR1cm4gZmxhdHRlbkNoaWxkTGlzdFxufVxuXG5cbmZ1bmN0aW9uIGZpbmRET01Ob2RlKHJlZikge1xuICAgIGlmIChyZWYgPT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgaWYgKHJlZi5ub2RlVHlwZSA9PT0gMSkge1xuICAgICAgICByZXR1cm4gcmVmO1xuICAgIH1cbiAgICByZXR1cm4gcmVmLl9fZG9tIHx8IG51bGw7XG59XG5cbi8qKlxuICogUmVhY3RET00ucmVuZGVyKCnlh73mlbDlhaXlj6NcbiAqIOa4suafk+e7hOS7tu+8jOe7hOS7tueahOWtkOe7hOS7tu+8jOmDveWcqOi/memHjFxuICogQHBhcmFtIHsqfSBWbm9kZVxuICogQHBhcmFtIHtFbGVtZW50fSBjb250YWluZXJcbiAqIEBwYXJhbSB7Ym9vbGVhbn0gaXNVcGRhdGVcbiAqIEBwYXJhbSB7Ym9vbGVhbn0gaW5zdGFuY2Ug55So5LqO5a6e546wcmVmc+acuuWItlxuICovXG5sZXQgZGVwdGggPSAwXG5cbmZ1bmN0aW9uIHJlbmRlckJ5THV5KFZub2RlLCBjb250YWluZXI6IEVsZW1lbnQsIGlzVXBkYXRlOiBib29sZWFuLCBwYXJlbnRDb250ZXh0LCBpbnN0YW5jZSkge1xuICAgIGNvbnN0IHtcbiAgICAgICAgdHlwZSxcbiAgICAgICAgcHJvcHNcbiAgICB9ID0gVm5vZGU7XG5cbiAgICBpZiAoIXR5cGUpIHJldHVybjtcbiAgICBjb25zdCB7Y2hpbGRyZW59ID0gcHJvcHM7XG4gICAgbGV0IGRvbU5vZGU7XG4gICAgaWYgKHR5cGVvZiB0eXBlID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIGNvbnN0IGZpeENvbnRleHQgPSBwYXJlbnRDb250ZXh0IHx8IHt9O1xuICAgICAgICBkb21Ob2RlID0gbW91bnRDb21wb25lbnQoVm5vZGUsIGNvbnRhaW5lciwgZml4Q29udGV4dCk7XG4gICAgfSBlbHNlIGlmICh0eXBlb2YgdHlwZSA9PT0gJ3N0cmluZycgJiYgdHlwZSA9PT0gJyN0ZXh0Jykge1xuICAgICAgICBkb21Ob2RlID0gbW91bnRUZXh0Q29tcG9uZW50KFZub2RlLCBjb250YWluZXIpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIGRvbU5vZGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KHR5cGUpO1xuICAgIH1cblxuICAgIGlmICh0eXBlb2YgdHlwZSAhPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAvL+W9k1Zub2Rl5piv5LiA5Liq6Jma5ouf57uE5Lu255qE5pe25YCZ77yM5YiZ5LiN6KaB5riy5p+T5LuW55qE5a2Q57uE5Lu277yM6ICM5piv562J5Yiw5Yib5bu65LuW5LqG5Lul5ZCO77yM5YaN5qC55o2u5LuW55qEcmVuZGVy5Ye95pWw5p2l5riy5p+TXG4gICAgICAgIGlmICh0eXBlTnVtYmVyKGNoaWxkcmVuKSA+IDIgJiYgY2hpbGRyZW4gIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgY29uc3QgTmV3Q2hpbGQgPSBtb3VudENoaWxkKGNoaWxkcmVuLCBkb21Ob2RlLCBwYXJlbnRDb250ZXh0LCBpbnN0YW5jZSwgVm5vZGUpLy9mbGF0dGVu5LmL5ZCO55qEY2hpbGQg6KaB5L+d5a2Y5LiL5p2lXG4gICAgICAgICAgICBwcm9wcy5jaGlsZHJlbiA9IE5ld0NoaWxkXG4gICAgICAgIH1cbiAgICB9XG4gICAgVm5vZGUuX2hvc3ROb2RlID0gZG9tTm9kZSAvL+e8k+WtmOecn+WunuiKgueCuVxuXG4gICAgaWYgKHR5cGVOdW1iZXIoZG9tTm9kZSkgPT09IDcpIHtcbiAgICAgICAgaWYgKGlzVXBkYXRlKSB7XG4gICAgICAgICAgICByZXR1cm4gZG9tTm9kZVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYgKGNvbnRhaW5lciAmJiBkb21Ob2RlICYmIGNvbnRhaW5lci5ub2RlTmFtZSAhPT0gJyN0ZXh0Jykge1xuICAgICAgICAgICAgICAgIGRvbU5vZGUuZm9yRWFjaCgoRE9NX1NJTkdMRV9Ob2RlKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnRhaW5lci5hcHBlbmRDaGlsZChET01fU0lOR0xFX05vZGUpXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIHNldFJlZihWbm9kZSwgaW5zdGFuY2UsIGRvbU5vZGUpLy/kuLromZrmi5/nu4Tku7bmt7vliqByZWZcbiAgICBtYXBQcm9wKGRvbU5vZGUsIHByb3BzLCBWbm9kZSkgLy/kuLrlhYPntKDmt7vliqBwcm9wc1xuXG4gICAgaWYgKGlzVXBkYXRlKSB7XG4gICAgICAgIHJldHVybiBkb21Ob2RlXG4gICAgfSBlbHNlIHtcbiAgICAgICAgVm5vZGUuX21vdW50SW5kZXggPSBtb3VudEluZGV4QWRkKClcbiAgICAgICAgaWYgKGNvbnRhaW5lciAmJiBkb21Ob2RlICYmIGNvbnRhaW5lci5ub2RlTmFtZSAhPT0gJyN0ZXh0Jykge1xuICAgICAgICAgICAgY29udGFpbmVyLmFwcGVuZENoaWxkKGRvbU5vZGUpXG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGRvbU5vZGVcbn1cblxuXG4vKipcbiAqXG4gKiBAcGFyYW0ge1Zub2RlfSBWbm9kZSBWbm9kZeaYr+S4gOmil+iZmuaLn0RPTeagke+8jOS7lueahOeUn+aIkOaWueW8j+aYr2JhYmVsLXRyYW5zZm9ybS1yZWFjdC1qc3josIPnlKhjcmVhdGVFbGVtZW506L+b6KGM55qE44CCXG4gKiBAcGFyYW0ge0VsZW1lbnR9IGNvbnRhaW5lciDov5nmmK/kuIDkuKrnnJ/lrp5ET03oioLngrnvvIznlKjkuo7mj5LlhaXomZrmi59ET03jgIJcbiAqL1xuZnVuY3Rpb24gcmVuZGVyKFZub2RlLCBjb250YWluZXIpIHtcbiAgICBpZiAodHlwZU51bWJlcihjb250YWluZXIpICE9PSA4KSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignVGFyZ2V0IGNvbnRhaW5lciBpcyBub3QgYSBET00gZWxlbWVudC4nKVxuICAgIH1cblxuICAgIGNvbnN0IFVuaXF1ZUtleSA9IGNvbnRhaW5lci5VbmlxdWVLZXlcbiAgICBpZiAoY29udGFpbmVyLlVuaXF1ZUtleSkgey8v5bey57uP6KKr5riy5p+TXG4gICAgICAgIGNvbnN0IG9sZFZub2RlID0gY29udGFpbmVyTWFwW1VuaXF1ZUtleV1cbiAgICAgICAgY29uc3Qgcm9vdFZub2RlID0gdXBkYXRlKG9sZFZub2RlLCBWbm9kZSwgY29udGFpbmVyKVxuICAgICAgICBydW5FeGNlcHRpb24oKTtcbiAgICAgICAgcmV0dXJuIFZub2RlLl9pbnN0YW5jZVxuICAgIH0gZWxzZSB7XG4gICAgICAgIC8v56ys5LiA5qyh5riy5p+T55qE5pe25YCZXG4gICAgICAgIFZub2RlLmlzVG9wID0gdHJ1ZTtcbiAgICAgICAgY29udGFpbmVyLlVuaXF1ZUtleSA9IG1vdW50SW5kZXhBZGQoKTtcbiAgICAgICAgY29udGFpbmVyTWFwW2NvbnRhaW5lci5VbmlxdWVLZXldID0gVm5vZGU7XG4gICAgICAgIHJlbmRlckJ5THV5KFZub2RlLCBjb250YWluZXIsIGZhbHNlLCBWbm9kZS5jb250ZXh0LCBWbm9kZS5vd25lcik7XG4gICAgICAgIHJ1bkV4Y2VwdGlvbigpO1xuICAgICAgICByZXR1cm4gVm5vZGUuX2luc3RhbmNlO1xuICAgIH1cbn1cblxuZXhwb3J0IHtcbiAgICBjcmVhdGVQb3J0YWwsXG4gICAgY3VycmVudE93bmVyLFxuICAgIHVwZGF0ZSxcbiAgICBmaW5kRE9NTm9kZSxcbiAgICByZW5kZXIsXG59XG4iXSwic291cmNlUm9vdCI6IiJ9