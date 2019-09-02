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
        
      </CardName.Slot>
      <CardName
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
  return (
    <SplitPane>
      <LeftPane>
        <Contacts />
      </LeftPane>
    </SplitPane>
  );
}