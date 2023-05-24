//any import used in getStaticProps or getServerSideProps won't be visible on the client
import fs from "fs/promises";
import path from "path";

const ProductDetailPage = (props) => {
  const { loadedProduct } = props;

  if (!loadedProduct) {
    return <p>Loading...</p>;
  }

  return (
    <>
      <h1>{loadedProduct.title}</h1>
      <p>{loadedProduct.description}</p>
    </>
  );
};


async function getData() {
    //cwd means, current working directory, which is the overAll project folder
    //then we build a path from there, i.e the cwd/data/dummy-backend.json,
    //join() is used to construct this path
    const filePath = path.join(process.cwd(), "data", "dummy-backend.json");
  
    //fs.readFileSync blockes the code from continuing until its done
    //const jsonData = await fs.readFileSync
    const jsonData = await fs.readFile(filePath);
    const data = JSON.parse(jsonData);
  
    return data;
  }


export async function getStaticProps(context) {
  const { params } = context;

  const productId = params.pid;

  const data = await getData();

  const product = data.products.find((product) => product.id === productId);

  if (!product) {
    //if this is set to true, this page will return a 404 page, you can do this if the code above
    //for some reason fails to fetch a data, maybe because you set fallback to false, which means
    //all the id's are specified in the paths, and any id not there will cause product to return null or 0
    //or any other reason that made product null, you can set this to true to render the notFound page
    return { notFound: true };
  }

  return {
    props: {
      loadedProduct: product,
    },
  };
}



export async function getStaticPaths() {
    const data = await getData();

    const ids = data.products.map(product => product.id);
    const pathsWithParams = ids.map(id => ({ params: { pid: id }}));

  //these id's is what is passed to getStaticProps through its context parameter to pregenerate a
  //page for that specific id

  return {
    //if fallback is set to true
    //try to specify the id's of pages that are visited frequently, since the page id specified
    //here is pre-generated on your machine when you build your project for production
    //the others a pregenerated on the server when the request for that page hits the serever
    //because you dont have to specify all the id's, since this dymanic pages might be thousands
    //and that's alot of pages to pregenterate, you rather pre-generate the rest when  a request hits the server

    paths: pathsWithParams,

    //if you set 'fallback' to true or 'blocking', this means that, not all the id's is specified here, so when next.js doesnt find this
    //id here, nextjs will now pregenerate this dynamically for an incoming request for that given id,not when you build your web for production,
    //since the only page that is pregenerated when you build your web for production is the one whose id is specified here,
    //the rest is generated when a request hits the server,  if it doesnt find a page(data) with that id, it returns a 404 page,
    //if you set it to 'blocking' youll stay in that page where you click that button to go to that dynamic page untill the page is ready and then displayed
    //if you set it to 'true', an empty page will be returned untill the page is ready
    //you can handle this by checking if the props returned in the component is empty
    //in an If fn in the Componet fn, to display a loading spinner before the content is ready like I did in the above Component fn,
    //if 'fallback' is set false,  this means that all the id's was specified here,
    //so it can be pre-rendered when you build your web for production, a 404page is returned if you try to access a page with an id
    //not specified here

    fallback: true,
  };
}

export default ProductDetailPage;

