# PlayPredict

A website to predict your play time built with Next.js.

Available on [playpredict.vercel.app](https://playpredict.vercel.app/)

## Demo

https://github.com/NintenSAGA/playpredict/assets/72867349/eb9c4457-fc2a-43be-ab85-9eaa7c1123ad

## Deployment

### Data Sources

* A Notion database page was used as the homepage's backend storage.
* Time statistic data are acquired through [unofficial HowLongToBeat API](https://github.com/ckatzorke/howlongtobeat)
* The introduction and platform information of games are acquired through Twitch's [IGDB API](https://api-docs.igdb.com)

Therefore, to let the project run on its full functionality, you have to fill in the following environment variables:

* `TWITCH_CID`
* `TWITCH_TOKEN`
* `NOTION_SECRET`
* `NOTION_PAGE_ID`

> Reference Notion page: [PlayPredict Storage](https://nintensaga.notion.site/3D-456bce089e1a4c8791e23177d26c22be?pvs=4)
> 
> Only the cover and attributes `OName` and `Tag` of each game page are used

### Basic Deployment

> Just the same as any other Next.js projects

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
