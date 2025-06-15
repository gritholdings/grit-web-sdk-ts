# amplify-next-chatbot

Preview: https://platform.meetgrit.com/

- Uses Next.js App Router v15
- Uses React (in Typescript)
- Uses Tailwind CSS
- Uses REST API
- Deployment to AWS App Runner

## Installation
1. Install node
    ```
    brew install node
    ```
1. Install npm packages
    ```
    npm install
    ```
1. Generate `amplify_outputs.json` using this command:
    ```
    npx ampx generate outputs --app-id YOUR_APP_ID --branch main
    ```
    Find YOUR_APP_ID from AWS console in Amplify -> Overview -> App ID

1. Go to https://aws.amazon.com, AWS Amplify, select the app, go to Hosting -> Environment variables -> add new:
    ```
    Variable: NEXT_PUBLIC_API_BASE_URL
    Value: https://www.example.com
    ```
    Note that `Value` is your main django backend custom domain, not your aws amplify custom domain.

## Local Development

```
npm run dev
```

## Deployment To Production
1. Before deployment, check using
    ```
    npm run build
    ```
1. Commit to Git
    ```
    git commit -m "Your Message"
    git push
    ```

After a git push, it should automatically start deployment. Check https://aws.amazon.com.