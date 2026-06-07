const mongoose = require("mongoose")
const blacklistTokenSchema = new mongoose.Schema({
    token: { type: String, required: [true, "token required to add in blacklist"] },
}, {
    timestamps: true
}
)
const tokenBlackListModel = mongoose.model("blacklistTokens", blacklistTokenSchema);

module.exports = tokenBlackListModel;