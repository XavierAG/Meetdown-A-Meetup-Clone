import AWS from "aws-sdk";

const awsConfig = {
  accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
  region: process.env.REACT_APP_AWS_REGION,
};

AWS.config.update(awsConfig);

const s3 = new AWS.S3();
export default s3;
