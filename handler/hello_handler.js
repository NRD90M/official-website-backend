const BaseHandler = require("../base/base_handler");

class helloHandler extends BaseHandler {
    constructor() {
        super(...arguments);
    }
    async hello() {
        try {
            this.logger.info();
            return {
                error: {
                    code: 0,
                    msg: "success"
                },
                message: "hello world!"
            };
        } catch (err) {
            this.logger.error(err);
        }
    }

}
module.exports = helloHandler;