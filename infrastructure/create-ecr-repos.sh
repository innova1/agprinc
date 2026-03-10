#!/bin/sh
# One-time setup: create both ECR repositories
# Run with an admin AWS profile before the first GitHub Actions push.

REGION=${AWS_REGION:-us-east-2}

aws ecr create-repository \
  --repository-name agprinc-backend \
  --region "$REGION" \
  --image-scanning-configuration scanOnPush=true

aws ecr create-repository \
  --repository-name agprinc-frontend \
  --region "$REGION" \
  --image-scanning-configuration scanOnPush=true

echo "Done. Add these secrets to your GitHub repo:"
echo "  AWS_ACCESS_KEY_ID"
echo "  AWS_SECRET_ACCESS_KEY"
