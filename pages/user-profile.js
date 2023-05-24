const UserProfilePage = (props) => {
  return <h1>{props.username}</h1>;
};

export default UserProfilePage;

//getStaticPaths is not required here because every page is pre-generated for every incoming request
//you also have to handle the situtaion where an Id for this page is not returned in the server
//check the 'products' folder file, to see how we returned the 'NotFoundPage' when value is null

//getServerSideProps pre-renders the page for every incoming request not at build time
//when we build our project for production, I recommend using it when youre using
//the Next.js serverside functionality with next-auth for authentication
//if your server is somewhere else, make your request for authentication on the client
//using the normal react.js useEffect, and store your token in the local storage,
//but if you want to use NexJs as a back-end for two differnt websites or mobile app;
//use the api Folder to write NodeJS(ExpressJs) code there which you use to generate your token
//using jwt, you can send a request to that api folder from getServerSide props, maybe to get a token, etc
//but use getServerSideProps only for authentication, to get the token, then use useEffect to fetch protected data with that token from the client,
//since that data is private and need to be available only on the client
//every other website or app can make request to this api folder from outside, since its litreally NodeJS(ExpressJs) code

//All the properties in getStaticProps is avaialble here except for 'revalidate'
//the only diff is that you get access to more properties in the context passes to
//getServerSide props and it pre-renders a page for every incoming request

export async function getServerSideProps(context) {
  const { params, req, res } = context;

  return {
    props: {
      username: "Max",
    },
  };
}
