import { ChatLogo } from "@shared/assets/icons";
import s from "./SignUp.module.css";
import { Link } from "react-router-dom";
import Input from "@shared/ui/Input/Input";
import Spinner from "@shared/ui/Spinner/Spinner";
import { useSignUp } from "../../model/hooks/useSignUp";

const SignUp = () => {
  const { handleSubmit, control, isPending, mutate } = useSignUp();

  if (isPending) {
    return <Spinner />;
  }

  return (
    <section className={s.signUp}>
      <div className={s.signUpWrapper}>
        <div className={s.top}>
          <ChatLogo height="35" width="35" />
          <h1>Chatter</h1>
        </div>
        <form
          className={s.form}
          onSubmit={handleSubmit((data) => mutate(data))}
        >
          <Input control={control} name="name" placeholder="Your Name" />
          <Input control={control} name="email" placeholder="Your Email" />
          <Input
            control={control}
            name="password"
            icon
            placeholder="Password"
          />
          <Input
            control={control}
            name="confirmPassword"
            icon
            placeholder="Confirm Password"
          />
          <button className={s.btn} type="submit">
            Sign Up
          </button>
        </form>
        <p>
          Already have an account? <Link to={"/sign-in"}>Sign In</Link>
        </p>
      </div>
    </section>
  );
};

export default SignUp;
