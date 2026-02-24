
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
const getCookie = () => {
  const payload = {
    id: new mongoose.Types.ObjectId(),
    email: 'test1234321@test.com',
  };
  
  const token = jwt.sign(payload, process.env.JWT_KEY!);
  console.log(process.env.JWT_KEY);
  const session = { jwt: token };
  const sessionJson = JSON.stringify(session);
  const base64 = Buffer.from(sessionJson).toString('base64');
   return [`session=${base64}`];
;
};
export default getCookie;
