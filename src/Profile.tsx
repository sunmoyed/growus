import React from "react";
import { auth, reauthenticate } from "./Auth";
import { User } from "./types";
import { User as FirebaseUser } from "firebase/app";
import { updateUser, getUserByUsername } from "./Database";
import { Link } from "./History";
import { UserIcon } from "./User";

const ERR_RELOGIN = "auth/requires-recent-login";

type ProfileProps = {
  onUserUpdate?: (user: FirebaseUser | null) => void;
  profilePage: string;
  userData: User;
};

type StateProps = {
  error: string;
  input: string;
  initialLoad: boolean;
  profileData?: User;
  userData: User;
};

export default class Profile extends React.PureComponent<
  ProfileProps,
  StateProps
> {
  constructor(props) {
    super(props);
    const { profilePage } = props;
    let initialLoad = false;

    if (profilePage) {
      this.getUserInfo(profilePage);
      initialLoad = true;
    }

    this.state = {
      error: "",
      input: "",
      initialLoad,
      profileData: undefined,
      userData: this.props.userData
    };
  }

  componentDidUpdate(prevProps, prevState) {
    const { profilePage } = this.props;
    const currentProfile = prevState.profileData
      ? prevState.profileData.username
      : null;

    if (
      profilePage !== prevProps.profilePage &&
      !!profilePage &&
      currentProfile !== profilePage
    ) {
      this.getUserInfo(profilePage);
    }
  }

  getUserInfo = async username => {
    try {
      const profileData = await getUserByUsername(username);

      this.setState({ profileData, error: "", initialLoad: false });
    } catch {
      this.setState({
        error: "there's no person behind this username."
      });
    }
  };

  updateName = async e => {
    e.preventDefault();
    const { input } = this.state;
    const { onUserUpdate } = this.props;

    const appUser = auth.currentUser;

    if (appUser) {
      try {
        await appUser.updateProfile({ displayName: input });
        onUserUpdate && onUserUpdate(appUser);
        this.setState({ error: "" });
      } catch {
        this.setState({ error: "I didn't learn your name." });
      }
    }
  };

  updateAccount = async e => {
    e.preventDefault();
    const { onUserUpdate } = this.props;

    const appUser = auth.currentUser;
    const form = new FormData(e.target);
    const userData = {
      username: form.get("username"),
      displayName: form.get("displayName"),
      goals: form.get("goals"),
      berry: form.get("berry")
    };

    if (appUser) {
      updateUser(appUser.uid, userData);
      onUserUpdate && onUserUpdate(appUser);
    }
  };

  deleteAccount = async () => {
    if (
      !window.confirm(
        "do you want to delete your account? you won't be able to get it back."
      )
    ) {
      return;
    }
    const { onUserUpdate } = this.props;
    const appUser = auth.currentUser;

    if (appUser) {
      try {
        await appUser.delete();
        onUserUpdate && onUserUpdate(appUser);
      } catch (error) {
        if (error.code === ERR_RELOGIN) {
          // Prompt the user to re-provide their sign-in credentials
          await reauthenticate(appUser);
          this.deleteAccount();
        } else {
          this.setState({ error: error.message });
        }
      }
    }
  };

  handleSignOut = e => {
    e.preventDefault();
    auth.signOut();
  };

  render() {
    if (this.state.initialLoad) {
      return null;
    }
    const { error, profileData, userData } = this.state;
    const { profilePage } = this.props;
    const updated =
      userData && userData.updated ? userData.updated.toDate() : null;

    if (!!profilePage && profileData !== undefined && userData !== null) {
      return (
        <UserFacts
          isYou={userData.username === profileData.username}
          user={profileData}
        />
      );
    }

    return (
      <div className="section">
        <h3>Profile</h3>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <form className="section" onSubmit={this.updateAccount}>
          <label>
            What are you called?
            <input
              type="text"
              name="displayName"
              defaultValue={userData ? userData.displayName : ""}
            />
          </label>
          <label>
            username
            <input
              type="text"
              name="username"
              defaultValue={userData ? userData.username : ""}
            />
          </label>
          <label>
            about{" "}
            <span role="img" aria-label="sparkles">
              ✨
            </span>
            <textarea
              name="about"
              defaultValue={userData ? userData.about : ""}
              placeholder="what do you want to do in life? what makes you happy?"
            />
          </label>
          <label>
            goals{" "}
            <span role="img" aria-label="sprout">
              🌱
            </span>
            <textarea
              name="goals"
              defaultValue={userData ? userData.goals : ""}
              placeholder="what are you learning and working on in the next couple months?"
            />
          </label>
          <label>
            favourite berry{" "}
            <span role="img" aria-label="berry">
              🍌
            </span>
            <input
              type="text"
              name="berry"
              defaultValue={userData ? userData.berry : ""}
              placeholder="jalapeño"
            />
          </label>
          <button type="submit">that's me</button> (
          <Link href={`/profile/${userData.username}`} inline>
            see yourself
          </Link>
          )
        </form>
        {updated && (
          <p>
            updated {updated.toDateString()} {updated.toLocaleTimeString()}
          </p>
        )}
        <p>
          <button className="text-button" onClick={this.handleSignOut}>
            logout
          </button>
        </p>
        <p>
          <button className="text-button" onClick={this.deleteAccount}>
            delete account
          </button>
        </p>
      </div>
    );
  }
}

const UserFacts = ({ isYou, user }: { isYou: boolean; user: User }) => {
  const { displayName, imgSrc, username, about, goals, berry } = user;
  return (
    <div>
      <section
        style={{
          display: "flex",
          flexDirection: "row",
          gap: "1em",
          alignItems: "center"
        }}
      >
        <UserIcon
          displayName={displayName}
          imgSrc={imgSrc}
          size={70}
          username={username}
        />
        <div>
          <h2 style={{ marginBottom: "0.1em" }}>{displayName}</h2>
          <p className="description">
            @{username}
            {isYou && (
              <React.Fragment>
                {" "}
                (
                <Link href="/profile" inline>
                  edit
                </Link>
                )
              </React.Fragment>
            )}
          </p>
        </div>
      </section>
      <section>
        <p>{about ? about : "a mysterious bean"}</p>
      </section>
      <section>
        <h4>
          goals{" "}
          <span role="img" aria-label="sprout">
            🌱
          </span>
        </h4>
        <p>{goals ? goals : "we don't know"}</p>
      </section>
      <section>
        <h4>
          favourite berry{" "}
          <span role="img" aria-label="berry">
            🍌
          </span>
        </h4>
        <p>{berry ? berry : "unknown"}</p>
      </section>
    </div>
  );
};
