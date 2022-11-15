  enum ActivityStatus { //value
  Edit = '编辑',
  Preonline = '预上线',
  Online = '2',
  Offline = '3',
}
const renderStatus = (item: "Edit" | "Preonline" | "Online" | "Offline") => {
  const desc = ActivityStatus.Edit;
  const desc2 = ActivityStatus[item];
}; 
