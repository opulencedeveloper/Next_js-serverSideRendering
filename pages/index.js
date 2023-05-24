//any import used in getStaticProps or getServerSideProps won't be visible on the client
import fs from "fs/promises";
import Link from "next/link";
import path from "path";

function HomePage(props) {
  const { products } = props;

  return (
    <ul>
      {products.map((product) => (
        <li key={product.id}>
          <Link href={`/products/${product.id}`}>{product.title}</Link>
        </li>
      ))}
    </ul>
  );
}

export async function getStaticProps() {
  //cwd means, current working directory, which is the overAll project folder
  //then we build a path from there, i.e the cwd/data/dummy-backend.json,
  //join() is used to construct this path
  const filePath = path.join(process.cwd(), "data", "dummy-backend.json");

  //fs.readFileSync blockes the code from continuing until its done
  //const jsonData = await fs.readFileSync
  const jsonData = await fs.readFile(filePath);
  const data = JSON.parse(jsonData);

  if (!data) {
    //This is used to redirect to user to a page no data was found
    return {
      redirect: {
        destination: "/data/nodata/",
      },
    };
  }

  if (data.products.length === 0) {
    //if this is set to true, this page will return a 404 page, you can do this if the code above
    //for some reason fails to fetch a data, maybe because you set fallback to false, which means
    //all the id's are specified in the paths, and any id not there will cause product to return null or 0
    //or any other reason that made product null, you can set this to true to render the notFound page
    return { notFound: true };
  }
  return {
    props: {
      products: data.products,
    },
    //here, this page regenerates if the request made is 10sec older than when
    //the page was last regenerated, if not, the existing page will be served
    revalidate: 10,
  };
}

export default HomePage;
