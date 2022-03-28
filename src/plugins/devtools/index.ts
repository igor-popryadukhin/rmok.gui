import { setupDevtoolsPlugin } from '@vue/devtools-api'
import Vue from 'vue'

export function setupDevtools (app) {
  setupDevtoolsPlugin({
    id: 'my-awesome-devtools-plugin',
    settings: {
      test1: {
        label: 'I like vue devtools',
        type: 'boolean',
        defaultValue: true
      },
      test2: {
        label: 'Quick choice',
        type: 'choice',
        defaultValue: 'a',
        options: [
          { value: 'a', label: 'A' },
          { value: 'b', label: 'B' },
          { value: 'c', label: 'C' }
        ],
        component: 'button-group'
      },
      test3: {
        label: 'Long choice',
        type: 'choice',
        defaultValue: 'a',
        options: [
          { value: 'a', label: 'A' },
          { value: 'b', label: 'B' },
          { value: 'c', label: 'C' },
          { value: 'd', label: 'D' },
          { value: 'e', label: 'E' }
        ]
      },
      test4: {
        label: 'What is your name?',
        type: 'text',
        defaultValue: ''
      }
    },
    app
  }, (api) => {
    console.log(api.getSettings())
  })
}

class DevtoolsPlugin {
  public install (app) {
    setupDevtools(app)
  }
}

const devtoolsPlugin: DevtoolsPlugin = new DevtoolsPlugin()

Vue.use(devtoolsPlugin)
