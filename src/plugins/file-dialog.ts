import Vue from 'vue';

interface FileDialogOptions {
  multiple?: boolean;
  accept?: string;
}

const defaultOptions: FileDialogOptions = {
  accept: '*/*',
  multiple: false
};

export class FileDialog {
  public open (options: FileDialogOptions = defaultOptions): Promise<File | FileList> {
    return new Promise((resolve) => {
      const input: HTMLInputElement = document.createElement('input');
      input.type = 'file';
      input.multiple = options.multiple || false;
      input.accept = options.accept || '*/*';
      input.onchange = () => {
        if (!input.files) {
          return;
        }
        if (options.multiple) {
          resolve(input.files);
        } else {
          resolve(input.files[0]);
        }

        input.remove();
      };
      input.click();
    });
  }
}

const fd = new FileDialog();

Vue.use({
  install () {
    Object.defineProperties(Vue.prototype, {
      $fileDialog: {
        get () {
          return fd;
        }
      }
    });
  }
});
