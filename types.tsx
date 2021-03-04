export type RootStackParamList = {
  Home: undefined;
  NotFound: undefined;
  New: undefined;
  ContactList: {
    onSelect: (user: Models.User) => void;
  };
  Room: {
    dealId?:number, 
    onGoBack?:(dealId:number) => void,
    dealDetail: Models.RoomDeal
  };
  DealDetail: {
    dealId?:number, 
    onGoBack?: (dealId:number) => void,
  };
  ChatHistory: {deal?:Models.Deal},
  UserProfile: {userId?: number}
  Signin: undefined;
  Signup: undefined;
  AddressList: {
    onSelectAddress?: (address: Models.Address) => void;
    refresh?: boolean;
    isFromChat?: boolean;
  };
  NewAddress: {
    onRefresh:()=>void
  },
  PrivatePolicy: undefined,
  Questionnaire: undefined
};

export type BottomTabParamList = {
  Dashboard: undefined;
  Messages: {refresh?:boolean; test?:string};
  NewContact: undefined,
  Room: {
    dealId?:number, 
    onGoBack?:(dealId:number) => void,
    dealDetail: Models.RoomDeal
  };
  DealDetail: {
    dealId?:number, 
    onGoBack?: (dealId:number) => void
  };
  ChatHistory: {deal?:Models.Deal},
  AddNew: undefined;
  Social: undefined;
  Profile: undefined;
  Signin: undefined;
  Signup: undefined;
};

export type DrawerTabParamList = {
  Profile: undefined;
  Nickname: undefined;
  QrCode: undefined;
  Address: undefined;
  Settings: undefined
}

export type DashboardParamList = {
  Dashboard: undefined;
};

export type MessagesParamList = {
  Messages: {refresh?:boolean};
  NewContact: undefined;
};

export type AddNewParamList = {
  AddNew: undefined;
  New: undefined;
};

export type SocialParamList = {
  Social: undefined;
};

export type ProfileParamList = {
  Profile: undefined;
};

export type SettingsStackParamList = {
  Nickname: undefined;
  Setting: undefined;
  About: undefined;
}

export enum DEAL_STATUS {
  IN_PROGRESS = 1,
  PENDING = 2,
  COMPLETE = 3,
  CANCEL = 4,
}

export enum NOTIFICATION_TYPE {
  CONTACT_REQUEST = 'CONTACT_REQUEST',
  CONTACT_ADDED = 'CONTACT_ADDED',
  CONTACT_REQUEST_RESPONSED = 'CONTACT_REQUEST_RESPONSED',
  DEAL_REQUEST = 'DEAL_REQUEST',
  DEAL_REQUEST_APPROVED = 'DEAL_REQUEST_APPROVED',
  DEAL_REQUEST_REJECTED = 'DEAL_REQUEST_REJECTED',
  DEAL_APPROVED = "DEAL_APPROVED",
  DEAL_CANCELLED = 'DEAL_CANCELLED',
  DEAL_COMMENT = 'DEAL_COMMENT',
  DEAL_LIKE = 'DEAL_LIKE',
  DEAL_PUBLISHED = 'DEAL_PUBLISHED'
}

export declare namespace Models {
  export type User = {
    [key: string]: any;
    user_id: number;
    username: string;
    nickname: string;
    avatar: string;
    user_config?: {
      id: number;
      is_quentionnaire_answered: boolean
    }
  }
  export type Address = {
    id:string; 
    address_line: string;
    city: string;
    province_state: string;
    postal_zip: string;
    country: string;
    phone: string;
  }
  export type Photo = {
    [key: string]: any;
    uri:string; 
    base64:string | undefined
  }
  export type Attachment = {
    [key: string]: any;
    id:string; 
    attachment:string | undefined
  }
  export type DealUser = {
    [key: string]: any;
    is_fullfilled:boolean;
    fullfilled_time: string;
    is_cancelled:boolean;
    cancelled_time: string;
    avatar: string;
  }
  export type RoomDeal = {
    sender_avatar?: string,
    sender_id: number,
    status: number,
    user?: number,
    is_public: boolean,
    description: string
  }
  export type Deal = {
    [key: string]: any;
    id: number;
    user_id: number;
    status: number;
    description: string;
    is_public: boolean;
    public_user: number,
    is_visible: boolean;
    start_date: string;
    end_date: string;
    dealattachment_set: Attachment[];
    dealuser_set: DealUser[];
    comment_count: number;
    like_count: number;
    self_liked_id: number;
  }
  export type Like = {
    [key: string]: any;
    id: number;
    user: number;
    deal: number;
    trade: number;
  }
  export type Thread = {
    [key: string]: any;
    id: number;
    user: number;
    username: string;
    nickname: string;
    avatar: string;
    comment: number;
    text: string;
  }
  export type Comment = {
    [key: string]: any;
    id: number;
    user: number;
    username: string;
    nickname: string;
    avatar: string;
    deal: number;
    trade: number;
    text: string;
    thread_set: Thread[]
  }
  export type Message = {
    id: number; 
    user_id: number;
    text: string; 
    user: number; 
    deal: number;
    deal_description: string;
    is_read: boolean;
    created_time: string;
    type: string;
    isLoading?:boolean;
    image?:string;
    address: Models.Address;
    qr_image: string
  }
  export type Room = {
    dealId: number;
    title: string; 
    unRead: number; 
    messages: Message[]
  }
  export type Notification = {
    id: number; 
    type: NOTIFICATION_TYPE;
    title: string; 
    description: string; 
    user: number;
    target_id: number;
    is_read: boolean; 
    avatar:string; 
    created_time: string;
  }
  export type QuestionAnswer = {
    id: number; 
    question: number;
    answer: string
  }
  export type Question = {
    id: number; 
    question: string;
    questionnaireanswer_set: QuestionAnswer[]
  }
}