import Link from "next/link";
import { Suspense } from "react";
import Footer from "../../components/footer";
const products = [{ name: "bag",query:"bag" }, { name: "shoes",query:"shoes" }, { name: "socks",query:"socks" }];

export default function Home() {
  return (
    <div>
      <Footer />
      <ul>
        {products.map((product) => {
          return (
            <li key={product.name}>
              <Link href={`/products/${product.name}`} >
                {product.name}
              </Link>
            </li>
          );
        })}
        <li>
          <Link href="/about">
            About
          </Link>
          
        </li>
        <li>
        <Link href="/three">
            Three
          </Link>
        </li>
      </ul>
      <h1>Hello Next.js</h1>
        
    </div>
  );
}