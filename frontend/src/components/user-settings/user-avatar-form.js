import React from 'react';
import { gettext, siteRoot } from '../../utils/constants';
import toaster from '../toast';

const { avatarURL, csrfToken } = window.app.pageOptions;

class UserAvatarForm extends React.Component {

  constructor(props) {
    super(props);
    this.fileInput = React.createRef();
    this.form = React.createRef();
    this.state = {
      avatarSrc: avatarURL,
      isEditShown: false
    };
  }

  fileInputChange = () => {

    // no file selected
    if (!this.fileInput.current.files.length) {
      return;
    }

    const file = this.fileInput.current.files[0];
    const fileName = file.name; 

    // no file extension
    if (fileName.lastIndexOf('.') == -1) {
      toaster.danger(gettext('Please choose an image file.'), {
        duration: 5
      });
      return false;
    }

    const fileExt = fileName.substr((fileName.lastIndexOf('.') + 1)).toLowerCase();
    const allowedExt = ['jpg','jpeg', 'png', 'gif'];
    if (allowedExt.indexOf(fileExt) == -1) {
      const errorMsg = gettext('File extensions can only be {placeholder}.')
        .replace('{placeholder}', allowedExt.join(', '));
      toaster.danger(errorMsg, {duration: 5});
      return false;
    }

    // file size should be less than 1MB
    if (file.size > 1024*1024) {
      const errorMsg = gettext('The file is too large. Allowed maximum size is 1MB.');
      toaster.danger(errorMsg, {duration: 5});
      return false;
    }

    this.form.current.submit();
  }

  openFileInput = () => {
    this.fileInput.current.click();
  }

  handleMouseOver = () => {
    this.setState({
      isEditShown: true
    });
  }

  handleMouseOut = () => {
    this.setState({
      isEditShown: false
    });
  }

  render() {
    return (
      <form ref={this.form} className="form-group row" encType="multipart/form-data" method="post" action={`${siteRoot}avatar/add/`}>
        <input type="hidden" name="csrfmiddlewaretoken" value={csrfToken} />
        <label className="col-sm-1 col-form-label">{gettext('Avatar:')}</label>
        <div className="col-sm-11">
          <img src={avatarURL} width="80" height="80" alt="" className="user-avatar mr-2 align-text-top" />
        </div>
      </form>
    );
  }
}

export default UserAvatarForm;
