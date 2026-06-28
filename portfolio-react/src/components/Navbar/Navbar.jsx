import CardNav from "../CardNav/CardNav.jsx";
import "./Navbar.css";

// The site's navigation is the CardNav (expandable card menu).
// Navbar is a thin wrapper so the navigation has a clear home in the tree.
export default function Navbar() {
  return <CardNav />;
}
