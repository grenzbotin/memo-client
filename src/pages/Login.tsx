import LoginForm from "../components/LoginForm";
import Navbar from "../components/Navbar";

function Login() {
  return (
    <>
      <Navbar />
      <main className="container">
        <article className="grid">
          <LoginForm />
        </article>
      </main>
    </>
  );
}

export default Login;
