import { Link } from "@remix-run/react";

export default function Index() {
  return (
    <div>
      <h1>Remixed Form</h1>
      <ul>
        <li>
          <Link to="/multi-item-form">Multi-Item Form</Link>
        </li>
      </ul>
    </div>
  );
}
