const BaseHandler = require("../base/base_handler");
const path = require("path");
const fs = require("fs");
class HandlerLoader extends BaseHandler {
    constructor() {
        super(...arguments);
        this.__registHandler();
    }
    /**
     * 对需要鉴权的handler('v_'开头的handler)进行一层封装
     * @param {function} handler 
     */
    authWarp(handler, func) {
        handler.__proto__[func] = async function () {
            let length = arguments.length;
            let login = arguments[length - 1];
            if (login === false) {
                throw new Error("用户未登录！");
            }
            return await handler.__proto__["v_" + func].apply(handler, arguments);
        };
        return handler;
    }
    __registHandler() {
        this.handlerMap = {};
        let files = fs.readdirSync(__dirname);
        files.forEach(file => {
            if (file === "index.js" || path.extname(file) !== ".js") return;
            let handler = new (require(path.join(__dirname, file)));
            let funcNames = Object.getOwnPropertyNames(handler.__proto__).filter(name => {
                return typeof handler.__proto__[name] === "function" && name !== "constructor";
            });
            funcNames.forEach(func => {
                if (!this.handlerMap[func]) {
                    if (func.match("v_") != null) {
                        func = func.replace("v_", "");
                        this.handlerMap[func] = this.authWarp(handler, func);
                    } else {
                        this.handlerMap[func] = handler;
                    }
                } else {
                    throw new Error("depulicate funcName, funcName:" + func);
                }
            });
            this.logger.info(`handler ${file}\tload success.`);
        });
    }
    getHandler(funcName) {
        if (this.handlerMap[funcName]) {
            return this.handlerMap[funcName];
        } else {
            let error = new this.Error(1000, "Invalid function name, name:" + funcName);
            throw error;
        }
    }
}

module.exports = new HandlerLoader();