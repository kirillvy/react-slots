import { useScope } from "./src";

const LeftPane = createSlot(Contacts)
const RightPane = createSlot(Chat)

function SplitPane({children}) {
  const scope = useChildren(children)
  return (
    <div className="SplitPane">
      <LeftPane.Slot scope={scope} />
      <RightPane.Slot scope={scope} childIs={'fallback'} >
        Chat disabled.
      </RightPane.Slot>
    </div>
  );
}

const Card = ({data, children}) => {
  const scope = useChildren(children)
  return (
    <div>
      <CardName.Slot
        scope={scope}
        fallback={data.name}
      />
      <CardAuthor.Slot
        scope={scope}
        childIs={'fallback'}>
        {data.author}
      </CardAuthor.Slot>
      <CardDescription.Slot
        childIs={'fallback'}>
        {data.description}
      </CardDescription.Slot>
      <CardReplies.Slot
        scope={scope}
        childIs={'fallback'}>
        {data.replies}
      </CardReplies.Slot>
      <CardRating.Slot
        scope={scope}
        childIs={'fallback'}>
        {data.rating}
      </CardRating.Slot>
    </div>
  )
}

function App() {
  const [contacts, setContacts] = useState({});
  const [chatId, setChatId] = useState(-1);
  const [chatData, setChatData] = useState({})
  const getChat = fetchData('/chat', {chatId}, GET).then(res => setChatData(res.data));
  const setChat = fetchData('/chat', {chatId, data}, POST).then(res => setChatData(res.data));
  useState(() => {
    fetchData('/contacts', {}, GET).then(res => setContacts(res.data));
    setInterval(getChat, 1000);
  }, [])
  return (
    <SplitPane>
        <Contacts contacts={contacts} onChange={setChatId} />
        <Chat chatData={chatData} onMsg={setChat} />
    </SplitPane>
  );
}

const Contacts = ({contacts, onChange}) => {
  return <ContactsCardPopup>
    {
      contacts.map((el) => (
        <SingleContact onClick={() => onChange(el.id)}>
          <ContactAvatar image={el.image} />
          <ContactName>{el.name}</ContactName>
          {
            el.isOnline && <ContactIsOnline />
          }
        </SingleContact>
      ))
    }
  </ContactsCardPopup>
}

const SingleContact = createSlot();

const ContactsCard = ({children}) => {
  const scope = useScope(children);
  return <ContactsContainer>
    <SingleContact.Slot
      scope={scope}
      multiple={true}
    >
      <ContactAvatar.Slot scope={SingleContact.Context} props={{image: '/default.jpg'}} />      
      <ContactName.Slot scope={SingleContact.Context} />
      <ContactIsOnline.Slot scope={SingleContact.Context} />
    </SingleContact.Slot>
  </ContactsContainer>
}

const ContactsCardPopup = ({children}) => {
  const scope = useScope(children);
  return <ContactsCard>
    <SingleContact.Before>
      <ContactHeader.Slot scope={scope} />
    </SingleContact.Before>
    <ContactName.After>
      <ContactLastOnline.Slot scope={scope} />
    </ContactName.After>
    {children}
  </ContactsCard>
}