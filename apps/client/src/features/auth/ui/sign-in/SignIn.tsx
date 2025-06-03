import { Link } from "react-router-dom";
import s from "./SignIn.module.css";
import { ChatLogo } from "@shared/assets/icons";
import Input from "@shared/ui/Input/Input";
import { useSignIn } from "../../model/hooks/useSignIn";
import Spinner from "@shared/ui/Spinner/Spinner";

const SignIn = () => {
  const { handleSubmit, control, mutate, isPending } = useSignIn();

  if (isPending) {
    return <Spinner />;
  }

  return (
    <section className={s.signUp}>
      <div className={s.signUpWrapper}>
        <div className={s.top}>
          <ChatLogo width="35" height="35" />
          <h1>Chatter</h1>
        </div>
        <form
          className={s.form}
          onSubmit={handleSubmit((data) => mutate(data))}
        >
          <Input control={control} name="email" placeholder="Email" />
          <Input
            control={control}
            name="password"
            icon
            placeholder="Password"
          />
          <button className={s.btn} type="submit">
            Sign In
          </button>
        </form>
        <p>
          You don't have an account yet? <Link to={"/sign-up"}>Sign Up</Link>
        </p>
      </div>
    </section>
  );
};

export default SignIn;
