import s from './NoMessages.module.css'
import icon from '@/shared/assets/images/nomessages.jpeg'

export const NoMessages = () => {
  return (
    <div className={s.wrapper}>
        <div className={s.content}>
            <span><strong>No messages here yet...</strong></span>
            <p>Send a message or tap on the greeting below.</p>
            <img src={icon} alt="icon" />
        </div>
    </div>
  )
}

