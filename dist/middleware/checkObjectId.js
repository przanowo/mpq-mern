"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
function checkObjectId(req, res, next) {
    if (!(0, mongoose_1.isValidObjectId)(req.params.id)) {
        res.status(404);
        throw new Error(`Invalid ObjectId of:  ${req.params.id}`);
    }
    next();
}
exports.default = checkObjectId;
