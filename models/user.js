var mongoose= require('mongoose');
var Schema = mongoose.Schema;

const userSchema= new Schema({
    name:{type:String,required:true},
    email:{type:String,required:true},
    password:{type:String,required:true},
  });

  const user = mongoose.model('users', userSchema);

  module.exports = user
  