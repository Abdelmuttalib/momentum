import Head from 'next/head';

const MyPage = () => {
  return (
    <>
      <Head>
        <meta property="og:title" content="Your Page Title" />
        <meta property="og:description" content="Your page description for social sharing" />
        <meta property="og:image" content="/path/to/your/image.jpg" />
        <meta property="og:url" content="https://yoursite.com/your-page" />
      </Head>
      {/* Your page content goes here */}
    </>
  );
};

export default MyPage;