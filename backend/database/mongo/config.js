// for local
// const url = 'mongodb://tandat:root_123456@localhost:27018/symphony?retryWrites=true'

//for docker
const url = 'mongodb://tandat:root_123456@mongo:27017/symphony?retryWrites=true'
const options = {
    user: process.env.MONGO_USER,
    pass: process.env.MONGO_PASSWORD,
    db: process.env.MONGO_DB,
    auth: {
        authdb: 'admin'
    },
    useNewUrlParser: true,
}

module.exports = {
  url,
  options
}
