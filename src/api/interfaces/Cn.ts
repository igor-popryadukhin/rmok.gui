export interface MySchema {
  id: number
  first_name: string
  last_name: string
  middle_name: null
  contact_name: string
  full_name: string
  address: string
  notes: string
  last_call_at: string | null
  created_at: string
  tz: string
  is_open: boolean
  location: {
    city: string
    region: string
    [k: string]: unknown
  }
  messenger_available: boolean
  messenger: null
  owner: {
    id: number
    first_name: string
    last_name: string
    full_name: string
    [k: string]: unknown
  }
  tags:
    | []
    | [
    {
      id: number
      name: string
      color: string
      [k: string]: unknown
    }
  ]
    | [
    {
      id: number
      name: string
      color: string
      [k: string]: unknown
    },
    {
      id: number
      name: string
      color: string
      [k: string]: unknown
    }
  ]
    | [
    {
      id: number
      name: string
      color: string
      [k: string]: unknown
    },
    {
      id: number
      name: string
      color: string
      [k: string]: unknown
    },
    {
      id: number
      name: string
      color: string
      [k: string]: unknown
    }
  ]
  project: {
    id: number
    name: string
    scenario: string
    statuses:
      | []
      | [
      {
        id: number
        name: string
        color: string
        children:
          | []
          | [
          {
            id: number
            name: string
            color: string
            [k: string]: unknown
          }
        ]
          | [
          {
            id: number
            name: string
            color: string
            [k: string]: unknown
          },
          {
            id: number
            name: string
            color: string
            [k: string]: unknown
          }
        ]
          | [
          {
            id: number
            name: string
            color: string
            [k: string]: unknown
          },
          {
            id: number
            name: string
            color: string
            [k: string]: unknown
          },
          {
            id: number
            name: string
            color: string
            [k: string]: unknown
          }
        ]
        [k: string]: unknown
      }
    ]
      | [
      {
        id: number
        name: string
        color: string
        children:
          | []
          | [
          {
            id: number
            name: string
            color: string
            [k: string]: unknown
          }
        ]
          | [
          {
            id: number
            name: string
            color: string
            [k: string]: unknown
          },
          {
            id: number
            name: string
            color: string
            [k: string]: unknown
          }
        ]
          | [
          {
            id: number
            name: string
            color: string
            [k: string]: unknown
          },
          {
            id: number
            name: string
            color: string
            [k: string]: unknown
          },
          {
            id: number
            name: string
            color: string
            [k: string]: unknown
          }
        ]
        [k: string]: unknown
      },
      {
        id: number
        name: string
        color: string
        children:
          | []
          | [
          {
            id: number
            name: string
            color: string
            [k: string]: unknown
          }
        ]
          | [
          {
            id: number
            name: string
            color: string
            [k: string]: unknown
          },
          {
            id: number
            name: string
            color: string
            [k: string]: unknown
          }
        ]
          | [
          {
            id: number
            name: string
            color: string
            [k: string]: unknown
          },
          {
            id: number
            name: string
            color: string
            [k: string]: unknown
          },
          {
            id: number
            name: string
            color: string
            [k: string]: unknown
          }
        ]
        [k: string]: unknown
      }
    ]
      | [
      {
        id: number
        name: string
        color: string
        children:
          | []
          | [
          {
            id: number
            name: string
            color: string
            [k: string]: unknown
          }
        ]
          | [
          {
            id: number
            name: string
            color: string
            [k: string]: unknown
          },
          {
            id: number
            name: string
            color: string
            [k: string]: unknown
          }
        ]
          | [
          {
            id: number
            name: string
            color: string
            [k: string]: unknown
          },
          {
            id: number
            name: string
            color: string
            [k: string]: unknown
          },
          {
            id: number
            name: string
            color: string
            [k: string]: unknown
          }
        ]
        [k: string]: unknown
      },
      {
        id: number
        name: string
        color: string
        children:
          | []
          | [
          {
            id: number
            name: string
            color: string
            [k: string]: unknown
          }
        ]
          | [
          {
            id: number
            name: string
            color: string
            [k: string]: unknown
          },
          {
            id: number
            name: string
            color: string
            [k: string]: unknown
          }
        ]
          | [
          {
            id: number
            name: string
            color: string
            [k: string]: unknown
          },
          {
            id: number
            name: string
            color: string
            [k: string]: unknown
          },
          {
            id: number
            name: string
            color: string
            [k: string]: unknown
          }
        ]
        [k: string]: unknown
      },
      {
        id: number
        name: string
        color: string
        children:
          | []
          | [
          {
            id: number
            name: string
            color: string
            [k: string]: unknown
          }
        ]
          | [
          {
            id: number
            name: string
            color: string
            [k: string]: unknown
          },
          {
            id: number
            name: string
            color: string
            [k: string]: unknown
          }
        ]
          | [
          {
            id: number
            name: string
            color: string
            [k: string]: unknown
          },
          {
            id: number
            name: string
            color: string
            [k: string]: unknown
          },
          {
            id: number
            name: string
            color: string
            [k: string]: unknown
          }
        ]
        [k: string]: unknown
      }
    ]
    [k: string]: unknown
  }
  contact_details:
    | []
    | [
    {
      id: number
      value: string
      type: string
      label: string
      [k: string]: unknown
    }
  ]
  contact_details_default: {
    id: number
    value: string
    type: string
    label: string
    [k: string]: unknown
  }
  last_status: {
    [k: string]: unknown
  } | null
  allow_call: boolean
  [k: string]: unknown
}
