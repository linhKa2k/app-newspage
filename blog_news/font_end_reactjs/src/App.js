import Auth from './components/Auth.js';
import Home from './components/Home.js';
import NotFound from './components/Notfound.js';
import CreatePost from './components/CreatePost.js';
import HeaderComponent from './commons/global/HeaderComponent';
import Verificationcode from './components/Verificationcode.js';
import Postsbycategory from './components/Postsbycategory.js';
import PostDetail from './components/PostDetail.js';
import AdminPage from './components/AdminPage.js';
import FooterComponent from './commons/global/FooterComponent';
import Search from './components/Search.js';
import Post24hours from './components/Post24hours.js';
import Profile from './components/Profile.js';
import PostWaiting from './components/PostWaiting.js'
import UpdatePost from './components/UpdatePost.js'
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import BrowsingPage from './components/BrowsingPage.js';
import SocketClient from './SocketClient.js';


function App() {

  return (
    <Router>
    <SocketClient/>
      <Switch>
        <Route exact path="/auth" component={Auth} />
        <Route exact path="/verificationcode" component={Verificationcode} />
        <Route path={`/admin`} component={AdminPage}/>
        <Route path="/404-not-found" component={NotFound}></Route>
        <Route
          path="/"
          render={() => (
            <>
      
              <HeaderComponent />
              <Switch>
                <Redirect exact from="/" to="/home" />
                <Route path={`/home`} component={Home} exact />
                <Route path={`/contribute`} component={CreatePost} />
                <Route path={`/browsing-page`} component={BrowsingPage} />
                <Route path={`/search`} component={Search} />
                <Route path={`/my-profile/:id`} component={Profile} />
                <Route path={`/updatepost/:id`} component={UpdatePost} />
                <Route path={`/24gio-qua`} component={Post24hours} />
                <Route path={`/post-waiting/:id`} component={PostWaiting} />
                <Route path={`/postsbycategory/:idcategory`} component={Postsbycategory} />
                <Route path={`/postdetail/:idpost`} component={PostDetail} />
                <Redirect from="*" to="/404-not-found" />
              </Switch>
              <FooterComponent/>

            </>

          )}
        />


      </Switch>
    </Router>
  );
}

export default App;
