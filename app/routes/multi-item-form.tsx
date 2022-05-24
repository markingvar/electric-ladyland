import type { MetaFunction } from "@remix-run/node";

const metaTitle = "Multi-Item Form";
const metaDescription = "TODO - Fill in description";

export let meta: MetaFunction = () => {
  return {
    title: metaTitle,
    description: metaDescription,
  };
};

export default function MultiItemForm() {
  return <h1>Multi Item Form</h1>;
}
