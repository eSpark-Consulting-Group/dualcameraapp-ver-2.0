import Amplify, { Auth, Storage } from "aws-amplify";

export function configureAmplify() {
  Amplify.configure({
    Auth: {
      identityPoolId: "us-east-2:23bb4585-4d49-4f74-ac6b-8b45d542a790",
      region: "us-east-2",
      userPoolId: "us-east-2_GElYBL6zR",
      userPoolWebClientId: "10vhgt95qkik4gla2e66370nnt",
    },
    Storage: {
      bucket: "raspistorage",
      region: "us-east-2",
      identityPoolId: "us-east-2:23bb4585-4d49-4f74-ac6b-8b45d542a790",
    },
  });
}
//Configure Storage with S3 bucket information
export function SetS3Config(bucket, level) {
  Storage.configure({
    bucket: bucket,
    level: level,
    region: "us-east-2",
    identityPoolId: "us-east-2:23bb4585-4d49-4f74-ac6b-8b45d542a790",
  });
}
