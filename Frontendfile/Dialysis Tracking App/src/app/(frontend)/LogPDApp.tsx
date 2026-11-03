'use client'

import { FormEvent, ReactNode, useEffect, useState, useTransition } from 'react'
import {
  addEmergencyContactAction,
  clearAllDataAction,
  loginAction,
  logoutAction,
  saveMoodAction,
  savePlanAction,
  saveProfileAction,
  setNotificationsAction,
  signupAction,
  toggleEmergencyContactAction,
  type AppUserView,
  type EmergencyContactView,
  type MoodEntryView,
  type PlanView,
} from './actions'

type Screen =
  | 'welcome'
  | 'auth'
  | 'home'
  | 'treatment'
  | 'treatment-form'
  | 'profile'
  | 'reminders'
  | 'mood'
  | 'settings'
  | 'privacy'
  | 'emergency'
type AuthMode = 'login' | 'create'
type HealthMetric = 'weight' | 'pressure' | 'pulse'
type TreatmentKind = 'green' | 'yellow' | 'red' | 'purple'

function Icon({ children, size = 22 }: { children: ReactNode; size?: number }) {
  return (
    <svg
      aria-hidden="true"
      className="shrink-0"
      fill="none"
      height={size}
      viewBox="0 0 24 24"
      width={size}
    >
      {children}
    </svg>
  )
}

const ArrowIcon = () => (
  <Icon>
    <path
      d="M5 12h14M13 6l6 6-6 6"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.8"
    />
  </Icon>
)

const DropIcon = ({ size = 34 }: { size?: number }) => (
  <Icon size={size}>
    <path
      d="M12 2.7S5.2 10.1 5.2 15.4a6.8 6.8 0 1 0 13.6 0C18.8 10.1 12 2.7 12 2.7Z"
      fill="currentColor"
    />
    <path
      d="M9 16.2c.35 1.35 1.25 2.15 2.7 2.45"
      stroke="white"
      strokeLinecap="round"
      strokeWidth="1.5"
    />
  </Icon>
)

function Brand({ light = false }: { light?: boolean }) {
  return (
    <div className={`brand ${light ? 'brand--light' : ''}`}>
      <span className="brand__mark">
        <DropIcon size={18} />
      </span>
      <span>LogPD</span>
    </div>
  )
}

function Welcome({ onContinue, onLogin }: { onContinue: () => void; onLogin: () => void }) {
  return (
    <main className="welcome">
      <div className="welcome__glow welcome__glow--one" />
      <div className="welcome__glow welcome__glow--two" />
      <header className="welcome__header">
        <Brand light />
        <span className="welcome__eyebrow">YOUR TREATMENT COMPANION</span>
      </header>

      <section className="welcome__content">
        <div className="hero-visual" aria-hidden="true">
          <div className="hero-visual__orbit hero-visual__orbit--outer" />
          <div className="hero-visual__orbit hero-visual__orbit--inner" />
          <div className="hero-visual__drop">
            <DropIcon size={72} />
          </div>
          <span className="hero-visual__pulse" />
          <span className="hero-visual__dot hero-visual__dot--one" />
          <span className="hero-visual__dot hero-visual__dot--two" />
        </div>
        <p className="kicker">Care that stays with you</p>
        <h1>Your dialysis journey, made a little lighter.</h1>
        <p className="welcome__copy">
          Track treatments, notice patterns, and keep your care information in one calm place.
        </p>
      </section>

      <div className="welcome__actions">
        <button className="button button--lime" onClick={onContinue} type="button">
          Get started <ArrowIcon />
        </button>
        <button className="text-button text-button--light" onClick={onLogin} type="button">
          I already have an account
        </button>
      </div>
    </main>
  )
}

function Auth({
  initialMode,
  onBack,
  onSuccess,
}: {
  initialMode: AuthMode
  onBack: () => void
  onSuccess: (user: AppUserView) => void
}) {
  const [mode, setMode] = useState<AuthMode>(initialMode)
  const [error, setError] = useState('')
  const [isPending, startTransition] = useTransition()

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const email = String(data.get('email') ?? '')
    const password = String(data.get('password') ?? '')
    const name = String(data.get('name') ?? '')
    setError('')
    startTransition(async () => {
      const result =
        mode === 'login'
          ? await loginAction({ email, password })
          : await signupAction({ email, name, password })
      if (result.ok) onSuccess(result.data)
      else setError(result.error)
    })
  }

  return (
    <main className="auth">
      <header className="auth__header">
        <button aria-label="Go back" className="icon-button" onClick={onBack} type="button">
          <Icon>
            <path
              d="M19 12H5M11 18l-6-6 6-6"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.8"
            />
          </Icon>
        </button>
        <Brand />
        <span className="header-spacer" />
      </header>

      <section className="auth__content">
        <div className="auth__intro">
          <p className="kicker kicker--blue">
            {mode === 'login' ? 'WELCOME BACK' : 'LET’S GET STARTED'}
          </p>
          <h1>{mode === 'login' ? 'Good to see you again.' : 'Create your care space.'}</h1>
          <p>
            {mode === 'login'
              ? 'Sign in to keep up with your treatment journey.'
              : 'A few details and you’ll be ready to start tracking.'}
          </p>
        </div>

        <div className="segmented" aria-label="Account action">
          <button
            className={mode === 'login' ? 'is-active' : ''}
            onClick={() => setMode('login')}
            type="button"
          >
            Log in
          </button>
          <button
            className={mode === 'create' ? 'is-active' : ''}
            onClick={() => setMode('create')}
            type="button"
          >
            Create account
          </button>
        </div>

        <form className="auth__form" onSubmit={submit}>
          {mode === 'create' && (
            <label>
              <span>Full name</span>
              <input autoComplete="name" name="name" placeholder="Your name" required type="text" />
            </label>
          )}
          <label>
            <span>Email address</span>
            <input
              autoComplete="email"
              name="email"
              placeholder="you@example.com"
              required
              type="email"
            />
          </label>
          <label>
            <span>Password</span>
            <input
              autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
              minLength={6}
              name="password"
              placeholder="At least 6 characters"
              required
              type="password"
            />
          </label>
          {mode === 'login' && (
            <button className="forgot" type="button">
              Forgot password?
            </button>
          )}
          {error && <p className="form-error">{error}</p>}
          <button className="button button--blue" disabled={isPending} type="submit">
            {isPending ? 'Please wait…' : mode === 'login' ? 'Log in' : 'Create my account'}{' '}
            <ArrowIcon />
          </button>
        </form>
        <p className="auth__privacy">
          Your health information is private and stays securely protected.
        </p>
      </section>
    </main>
  )
}

function TreatmentHeader({ title, onBack }: { title: string; onBack: () => void }) {
  return (
    <header className="flow-header">
      <button aria-label="Go back" className="icon-button" onClick={onBack} type="button">
        <Icon>
          <path
            d="M19 12H5M11 18l-6-6 6-6"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.8"
          />
        </Icon>
      </button>
      <span>{title}</span>
      <span className="header-spacer" />
    </header>
  )
}

const treatmentOptions: {
  id: TreatmentKind
  label: string
  strength: string
}[] = [
  { id: 'green', label: 'Green', strength: '2.5%' },
  { id: 'yellow', label: 'Yellow', strength: 'Hypodexrin' },
  { id: 'red', label: 'Red', strength: '4.25%' },
  { id: 'purple', label: 'Purple', strength: '1.5%' },
]

function TreatmentMenu({
  onBack,
  onSelect,
}: {
  onBack: () => void
  onSelect: (kind: TreatmentKind) => void
}) {
  return (
    <main className="treatment-flow">
      <TreatmentHeader onBack={onBack} title="Track treatment" />
      <section className="treatment-flow__body">
        <p className="kicker kicker--blue">TODAY’S SESSION</p>
        <h1>Choose your treatment.</h1>
        <p className="treatment-flow__intro">
          Select the color that matches the bag you are using today.
        </p>

        <div className="treatment-options">
          {treatmentOptions.map((option) => (
            <button
              aria-label={`Start ${option.label} treatment`}
              className={`treatment-option treatment-option--${option.id}`}
              key={option.id}
              onClick={() => onSelect(option.id)}
              type="button"
            >
              <strong>{option.label}</strong>
              <span>{option.strength}</span>
            </button>
          ))}
        </div>
      </section>
    </main>
  )
}

function TreatmentForm({
  kind,
  onBack,
  onSave,
}: {
  kind: TreatmentKind
  onBack: () => void
  onSave: () => void
}) {
  const option = treatmentOptions.find((item) => item.id === kind)!
  const now = new Date()
  const defaultDate = now.toISOString().slice(0, 10)
  const defaultTime = now.toTimeString().slice(0, 5)
  const [editedFields, setEditedFields] = useState<string[]>([])

  function suggestedInput(name: string) {
    return {
      className: editedFields.includes(name) ? 'is-confirmed' : 'is-suggested',
      onChange: () =>
        setEditedFields((current) => (current.includes(name) ? current : [...current, name])),
    }
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    onSave()
  }

  return (
    <main className={`treatment-form-page treatment-form-page--${kind}`}>
      <TreatmentHeader onBack={onBack} title="Treatment details" />
      <section className="treatment-form-page__body">
        <div className="form-hero">
          <span>COLOR OF BAG</span>
          <h1>{option.label}</h1>
        </div>

        <form className="treatment-data-form" onSubmit={submit}>
          <label className="data-row">
            <span>Date</span>
            <input defaultValue={defaultDate} required type="date" />
          </label>
          <label className="data-row">
            <span>Time</span>
            <input defaultValue={defaultTime} required type="time" />
          </label>
          <label className="data-row">
            <span>Dry weight</span>
            <div className="input-with-unit">
              <input
                defaultValue="72.4"
                inputMode="decimal"
                required
                step="0.1"
                type="number"
                {...suggestedInput('dryWeight')}
              />
              <span>kg</span>
            </div>
          </label>
          <label className="data-row">
            <span>Bag weight</span>
            <div className="input-with-unit">
              <input
                defaultValue="2.0"
                inputMode="decimal"
                required
                step="0.1"
                type="number"
                {...suggestedInput('bagWeight')}
              />
              <span>kg</span>
            </div>
          </label>
          <label className="data-row">
            <span>Temperature</span>
            <div className="input-with-unit">
              <input
                defaultValue="36.8"
                inputMode="decimal"
                required
                step="0.1"
                type="number"
                {...suggestedInput('temperature')}
              />
              <span>°C</span>
            </div>
          </label>
          <label className="data-row">
            <span>Blood pressure</span>
            <div className="blood-pressure-inputs">
              <div className="input-with-unit">
                <input
                  aria-label="Systolic blood pressure"
                  defaultValue="124"
                  inputMode="numeric"
                  required
                  type="number"
                  {...suggestedInput('systolic')}
                />
                <span>SYS</span>
              </div>
              <div className="input-with-unit">
                <input
                  aria-label="Diastolic blood pressure"
                  defaultValue="78"
                  inputMode="numeric"
                  required
                  type="number"
                  {...suggestedInput('diastolic')}
                />
                <span>DIA</span>
              </div>
            </div>
          </label>
          <label className="data-row">
            <span>Pulse</span>
            <div className="input-with-unit">
              <input
                defaultValue="72"
                inputMode="numeric"
                required
                type="number"
                {...suggestedInput('pulse')}
              />
              <span>bpm</span>
            </div>
          </label>

          <button className="button button--blue" type="submit">
            Save {option.label.toLowerCase()} treatment <ArrowIcon />
          </button>
        </form>
      </section>
    </main>
  )
}

function Profile({
  onBack,
  onEmergency,
  onLogout,
  onPrivacy,
  onSettings,
  onUserChange,
  user,
}: {
  onBack: () => void
  onEmergency: () => void
  onLogout: () => void
  onPrivacy: () => void
  onSettings: () => void
  onUserChange: (user: AppUserView) => void
  user: AppUserView
}) {
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')
  const [isPending, startTransition] = useTransition()
  const initials = user.name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  return (
    <main className="account-page">
      <TreatmentHeader onBack={onBack} title="Profile" />
      <section className="account-page__body">
        <div className="profile-hero">
          <span className="profile-hero__avatar">{initials}</span>
          <div>
            <h1>{user.name}</h1>
            <p>{user.email}</p>
          </div>
        </div>

        <form
          className="profile-form"
          onSubmit={(event) => {
            event.preventDefault()
            const data = new FormData(event.currentTarget)
            setError('')
            startTransition(async () => {
              const result = await saveProfileAction({
                dateOfBirth: String(data.get('dateOfBirth') ?? ''),
                healthcareProvider: String(data.get('healthcareProvider') ?? ''),
                name: String(data.get('name') ?? ''),
                notificationsEnabled: user.notificationsEnabled ?? true,
              })
              if (result.ok) {
                onUserChange(result.data)
                setSaved(true)
              } else {
                setError(result.error)
              }
            })
          }}
        >
          <label>
            <span>Name</span>
            <input defaultValue={user.name} name="name" required type="text" />
          </label>
          <label>
            <span>Date of birth</span>
            <input
              defaultValue={user.dateOfBirth?.slice(0, 10) ?? ''}
              name="dateOfBirth"
              type="date"
            />
          </label>
          <label>
            <span>Healthcare provider</span>
            <input
              defaultValue={user.healthcareProvider ?? ''}
              name="healthcareProvider"
              placeholder="Add your provider"
              type="text"
            />
          </label>
          {error && <p className="form-error">{error}</p>}
          <button className="button button--blue" disabled={isPending} type="submit">
            {isPending ? 'Saving…' : saved ? 'Saved' : 'Save profile'} <ArrowIcon />
          </button>
        </form>

        <div className="profile-menu">
          <button onClick={onSettings} type="button">
            <span>Settings</span>
            <ArrowIcon />
          </button>
          <button onClick={onPrivacy} type="button">
            <span>Privacy & security</span>
            <ArrowIcon />
          </button>
          <button onClick={onEmergency} type="button">
            <span>Emergency contacts</span>
            <ArrowIcon />
          </button>
        </div>
        <button
          className="profile-logout"
          onClick={() => {
            startTransition(async () => {
              await logoutAction()
              onLogout()
            })
          }}
          type="button"
        >
          Log out
        </button>
      </section>
    </main>
  )
}

function Settings({
  onBack,
  onUserChange,
  user,
}: {
  onBack: () => void
  onUserChange: (user: AppUserView) => void
  user: AppUserView
}) {
  const [largerText, setLargerText] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(false)
  const [notifications, setNotifications] = useState(user.notificationsEnabled ?? true)

  useEffect(() => {
    const storedLargeText = localStorage.getItem('logpd-large-text') === 'true'
    const storedReducedMotion = localStorage.getItem('logpd-reduced-motion') === 'true'
    setLargerText(storedLargeText)
    setReducedMotion(storedReducedMotion)
    document.documentElement.classList.toggle('logpd-large-text', storedLargeText)
    document.documentElement.classList.toggle('logpd-reduced-motion', storedReducedMotion)
  }, [])

  function updateAccessibility(key: 'logpd-large-text' | 'logpd-reduced-motion', enabled: boolean) {
    localStorage.setItem(key, String(enabled))
    document.documentElement.classList.toggle(key, enabled)
    if (key === 'logpd-large-text') setLargerText(enabled)
    else setReducedMotion(enabled)
  }

  async function updateNotifications() {
    const enabled = !notifications
    const result = await setNotificationsAction(enabled)
    if (result.ok) {
      setNotifications(enabled)
      onUserChange({ ...user, notificationsEnabled: enabled })
    }
  }

  return (
    <main className="settings-page">
      <TreatmentHeader onBack={onBack} title="Settings" />
      <section className="settings-page__body">
        <div className="settings-group">
          <p>GENERAL</p>
          <div className="settings-row">
            <div>
              <strong>Notifications</strong>
              <span>Treatment and care reminders</span>
            </div>
            <button
              aria-pressed={notifications}
              className={`toggle ${notifications ? 'is-on' : ''}`}
              onClick={updateNotifications}
              type="button"
            >
              <span />
            </button>
          </div>
          <div className="settings-row">
            <div>
              <strong>Units</strong>
              <span>Weight and temperature</span>
            </div>
            <b>kg · °C</b>
          </div>
          <div className="settings-row">
            <div>
              <strong>Language</strong>
              <span>App language</span>
            </div>
            <b>English</b>
          </div>
        </div>

        <div className="settings-group">
          <p>ACCESSIBILITY</p>
          <div className="settings-row">
            <div>
              <strong>Larger text</strong>
              <span>Increase text throughout the app</span>
            </div>
            <button
              aria-pressed={largerText}
              className={`toggle ${largerText ? 'is-on' : ''}`}
              onClick={() => updateAccessibility('logpd-large-text', !largerText)}
              type="button"
            >
              <span />
            </button>
          </div>
          <div className="settings-row">
            <div>
              <strong>Reduce motion</strong>
              <span>Limit interface animations</span>
            </div>
            <button
              aria-pressed={reducedMotion}
              className={`toggle ${reducedMotion ? 'is-on' : ''}`}
              onClick={() => updateAccessibility('logpd-reduced-motion', !reducedMotion)}
              type="button"
            >
              <span />
            </button>
          </div>
        </div>

        <div className="settings-group">
          <p>ABOUT</p>
          <div className="settings-row">
            <div>
              <strong>LogPD</strong>
              <span>Dialysis treatment companion</span>
            </div>
            <b>Version 1.0</b>
          </div>
        </div>
      </section>
    </main>
  )
}

function Privacy({ onBack, onCleared }: { onBack: () => void; onCleared: () => void }) {
  const [confirming, setConfirming] = useState(false)
  const [message, setMessage] = useState('')
  const [isPending, startTransition] = useTransition()

  function clearData() {
    startTransition(async () => {
      const result = await clearAllDataAction()
      if (result.ok) {
        localStorage.removeItem('logpd-large-text')
        localStorage.removeItem('logpd-reduced-motion')
        document.documentElement.classList.remove('logpd-large-text', 'logpd-reduced-motion')
        setMessage('Your health and contact data has been cleared.')
        setConfirming(false)
        onCleared()
      } else {
        setMessage(result.error)
      }
    })
  }

  return (
    <main className="privacy-page">
      <TreatmentHeader onBack={onBack} title="Privacy & security" />
      <section className="privacy-page__body">
        <div className="privacy-hero">
          <span className="privacy-lock">
            <Icon size={28}>
              <rect
                height="11"
                rx="2"
                stroke="currentColor"
                strokeWidth="1.8"
                width="14"
                x="5"
                y="10"
              />
              <path d="M8 10V7a4 4 0 0 1 8 0v3" stroke="currentColor" strokeWidth="1.8" />
            </Icon>
          </span>
          <h1>Your information belongs to you.</h1>
          <p>Data is stored locally on your device.</p>
          <small>
            When signed in, records are also securely synced to your private LogPD account so they
            remain available across sessions.
          </small>
        </div>

        <div className="privacy-list">
          <div>
            <strong>Private by default</strong>
            <span>Only you can view your health records.</span>
          </div>
          <div>
            <strong>Secure sign-in</strong>
            <span>Your account uses an encrypted, private session.</span>
          </div>
          <div>
            <strong>Notification privacy</strong>
            <span>Notification details follow your device settings.</span>
          </div>
        </div>

        <section className="danger-zone">
          <p>YOUR DATA</p>
          <h2>Clear all data</h2>
          <span>
            Removes moods, treatment reminders, emergency contacts, and profile health details. Your
            account remains active.
          </span>
          {!confirming ? (
            <button onClick={() => setConfirming(true)} type="button">
              Clear all data
            </button>
          ) : (
            <div className="clear-confirmation">
              <strong>Are you sure?</strong>
              <div>
                <button onClick={() => setConfirming(false)} type="button">
                  Cancel
                </button>
                <button disabled={isPending} onClick={clearData} type="button">
                  {isPending ? 'Clearing…' : 'Yes, clear data'}
                </button>
              </div>
            </div>
          )}
          {message && <small>{message}</small>}
        </section>
      </section>
    </main>
  )
}

function EmergencyContacts({
  initialContacts,
  onBack,
  onContactsChange,
}: {
  initialContacts: EmergencyContactView[]
  onBack: () => void
  onContactsChange: (contacts: EmergencyContactView[]) => void
}) {
  const [contacts, setContacts] = useState(initialContacts)
  const [adding, setAdding] = useState(false)
  const [error, setError] = useState('')
  const [isPending, startTransition] = useTransition()

  function addContact(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    setError('')
    startTransition(async () => {
      const result = await addEmergencyContactAction({
        automaticAfterHours: Number(data.get('automaticAfterHours')),
        firstName: String(data.get('firstName') ?? ''),
        lastName: String(data.get('lastName') ?? ''),
        phone: String(data.get('phone') ?? ''),
      })
      if (!result.ok) {
        setError(result.error)
        return
      }
      const next = [...contacts, result.data].sort((a, b) => a.contactOrder - b.contactOrder)
      setContacts(next)
      onContactsChange(next)
      setAdding(false)
    })
  }

  function toggleContact(contact: EmergencyContactView) {
    const enabled = !contact.automaticContact
    const next = contacts.map((item) =>
      item.id === contact.id ? { ...item, automaticContact: enabled } : item,
    )
    setContacts(next)
    onContactsChange(next)
    startTransition(async () => {
      const result = await toggleEmergencyContactAction(contact.id, enabled)
      if (!result.ok) {
        const reverted = next.map((item) =>
          item.id === contact.id ? { ...item, automaticContact: !enabled } : item,
        )
        setContacts(reverted)
        onContactsChange(reverted)
        setError(result.error)
      }
    })
  }

  return (
    <main className="emergency-page">
      <TreatmentHeader onBack={onBack} title="Emergency contacts" />
      <section className="emergency-page__body">
        <div className="emergency-intro">
          <p className="kicker kicker--blue">CONTACT ORDER</p>
          <h1>Your safety circle.</h1>
          <p>
            Choose who LogPD should contact, and how long to wait before each person is notified.
          </p>
        </div>

        <div className="contact-list">
          {contacts.length === 0 ? (
            <div className="contact-empty">
              <strong>No emergency contacts yet</strong>
              <span>Add someone you trust to get started.</span>
            </div>
          ) : (
            contacts.map((contact) => (
              <article className="contact-card" key={contact.id}>
                <span className="contact-order">{contact.contactOrder}</span>
                <div className="contact-card__copy">
                  <strong>
                    {contact.firstName} {contact.lastName}
                  </strong>
                  <span>{contact.phone}</span>
                  <small>Contact automatically after {contact.automaticAfterHours} hours</small>
                </div>
                <button
                  aria-label={`Contact ${contact.firstName} automatically after ${contact.automaticAfterHours} hours`}
                  aria-pressed={contact.automaticContact}
                  className={`toggle ${contact.automaticContact ? 'is-on' : ''}`}
                  onClick={() => toggleContact(contact)}
                  type="button"
                >
                  <span />
                </button>
              </article>
            ))
          )}
        </div>

        {!adding ? (
          <button className="button button--blue" onClick={() => setAdding(true)} type="button">
            Add emergency contact <ArrowIcon />
          </button>
        ) : (
          <form className="contact-form" onSubmit={addContact}>
            <div className="contact-form__heading">
              <h2>New emergency contact</h2>
              <button
                aria-label="Close contact form"
                onClick={() => setAdding(false)}
                type="button"
              >
                <Icon>
                  <path
                    d="m6 6 12 12M18 6 6 18"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeWidth="1.8"
                  />
                </Icon>
              </button>
            </div>
            <label>
              <span>First name</span>
              <input name="firstName" required type="text" />
            </label>
            <label>
              <span>Last name</span>
              <input name="lastName" required type="text" />
            </label>
            <label>
              <span>Phone number</span>
              <input
                inputMode="tel"
                name="phone"
                placeholder="(555) 000-0000"
                required
                type="tel"
              />
            </label>
            <label>
              <span>Contact automatically after</span>
              <div className="input-with-unit">
                <input
                  defaultValue={(contacts.length + 1) * 10}
                  max="168"
                  min="1"
                  name="automaticAfterHours"
                  required
                  type="number"
                />
                <span>hours</span>
              </div>
            </label>
            {error && <p className="form-error">{error}</p>}
            <button className="button button--blue" disabled={isPending} type="submit">
              {isPending ? 'Adding…' : 'Add contact'} <ArrowIcon />
            </button>
          </form>
        )}
      </section>
    </main>
  )
}

function Reminders({
  initialPlan,
  notificationsEnabled,
  onBack,
  onPlanChange,
}: {
  initialPlan: PlanView | null
  notificationsEnabled: boolean
  onBack: () => void
  onPlanChange: (plan: PlanView) => void
}) {
  const [recommendation, setRecommendation] = useState(initialPlan?.recommendation ?? '')
  const [schedule, setSchedule] = useState<string[]>(
    initialPlan?.reminders.map((item) => item.time) ?? [],
  )
  const [notifications, setNotifications] = useState(notificationsEnabled)
  const [error, setError] = useState('')
  const [isPending, startTransition] = useTransition()

  function createSchedule() {
    setError('')
    startTransition(async () => {
      const result = await savePlanAction(recommendation)
      if (result.ok) {
        setSchedule(result.data.reminders.map((item) => item.time))
        onPlanChange(result.data)
      } else setError(result.error)
    })
  }

  async function toggleNotifications() {
    if (!notifications && 'Notification' in window) {
      const permission = await Notification.requestPermission()
      const enabled = permission === 'granted'
      setNotifications(enabled)
      await setNotificationsAction(enabled)
      return
    }
    const enabled = !notifications
    setNotifications(enabled)
    await setNotificationsAction(enabled)
  }

  return (
    <main className="reminders-page">
      <TreatmentHeader onBack={onBack} title="Treatment reminders" />
      <section className="reminders-page__body">
        <div className="reminders-intro">
          <p className="kicker kicker--blue">YOUR CARE PLAN</p>
          <h1>Plan your treatment day.</h1>
          <p>Add your doctor’s recommendation and we’ll create a simple daily schedule.</p>
        </div>

        <label className="recommendation-box">
          <span>Doctor’s recommendation</span>
          <textarea
            onChange={(event) => setRecommendation(event.target.value)}
            placeholder="For example: Complete treatment three times each day…"
            rows={5}
            value={recommendation}
          />
        </label>
        <button
          className="button button--blue"
          disabled={!recommendation.trim()}
          onClick={createSchedule}
          type="button"
        >
          Create reminders <ArrowIcon />
        </button>
        {error && <p className="form-error">{error}</p>}

        <section className="generated-reminders">
          <div className="reminder-section-heading">
            <div>
              <p>DAILY SCHEDULE</p>
              <h2>Treatment reminders</h2>
            </div>
            <span>{schedule.length || 0} reminders</span>
          </div>
          {(schedule.length ? schedule : ['', '', '']).map((time, index) => (
            <div className="generated-reminder" key={`${time}-${index}`}>
              <span className="generated-reminder__check" />
              <div>
                <strong>{time || ' '}</strong>
                <span>{time ? 'Treatment' : ' '}</span>
              </div>
            </div>
          ))}
        </section>

        <section className="notification-control">
          <div>
            <strong>Notifications</strong>
            <p>Get an alert when it’s time for treatment.</p>
          </div>
          <button
            aria-label="Control treatment notifications"
            aria-pressed={notifications}
            className={`toggle ${notifications ? 'is-on' : ''}`}
            onClick={toggleNotifications}
            type="button"
          >
            <span />
          </button>
        </section>
      </section>
    </main>
  )
}

const moodOptions = [
  { id: 'great', face: '😄', label: 'Great' },
  { id: 'good', face: '🙂', label: 'Good' },
  { id: 'okay', face: '😐', label: 'Okay' },
  { id: 'low', face: '😕', label: 'Low' },
  { id: 'difficult', face: '😞', label: 'Difficult' },
] as const

function localDateKey(date: Date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function MoodTracker({
  initialEntries,
  onBack,
  onEntriesChange,
}: {
  initialEntries: MoodEntryView[]
  onBack: () => void
  onEntriesChange: (entries: MoodEntryView[]) => void
}) {
  const [entries, setEntries] = useState(initialEntries)
  const [mood, setMood] = useState<MoodEntryView['mood'] | null>(null)
  const [energy, setEnergy] = useState<MoodEntryView['energy'] | null>(null)
  const [note, setNote] = useState('')
  const [message, setMessage] = useState('')
  const [isPending, startTransition] = useTransition()
  const today = new Date()
  const dateKey = localDateKey(today)
  const recentDays = Array.from({ length: 7 }, (_, index) => {
    const date = new Date(today)
    date.setDate(today.getDate() - (6 - index))
    return date
  })

  function saveMood() {
    if (!mood || !energy) {
      setMessage('Choose a mood and energy level.')
      return
    }
    setMessage('')
    startTransition(async () => {
      const result = await saveMoodAction({ date: dateKey, energy, mood, note })
      if (!result.ok) {
        setMessage(result.error)
        return
      }
      const nextEntries = [
        result.data,
        ...entries.filter((entry) => entry.date.slice(0, 10) !== dateKey),
      ]
      setEntries(nextEntries)
      onEntriesChange(nextEntries)
      setMessage('Today’s mood has been saved.')
    })
  }

  return (
    <main className="mood-page">
      <TreatmentHeader onBack={onBack} title="Mood tracker" />
      <section className="mood-page__body">
        <section className="mood-calendar">
          <div className="mood-calendar__heading">
            <div>
              <p>THIS WEEK</p>
              <h1>Your mood</h1>
            </div>
            <span>{today.toLocaleDateString('en', { month: 'long' })}</span>
          </div>
          <div className="mood-calendar__days">
            {recentDays.map((date) => {
              const key = localDateKey(date)
              const entry = entries.find((item) => item.date.slice(0, 10) === key)
              const face = moodOptions.find((item) => item.id === entry?.mood)?.face
              return (
                <div className={key === dateKey ? 'is-today' : ''} key={key}>
                  <span>{date.toLocaleDateString('en', { weekday: 'narrow' })}</span>
                  <strong>{date.getDate()}</strong>
                  <i>{face ?? '·'}</i>
                </div>
              )
            })}
          </div>
        </section>

        <section className="mood-checkin">
          <div className="mood-question">
            <h2>How are you feeling?</h2>
            <div className="mood-options">
              {moodOptions.map((option) => (
                <button
                  aria-pressed={mood === option.id}
                  className={mood === option.id ? 'is-selected' : ''}
                  key={option.id}
                  onClick={() => setMood(option.id)}
                  type="button"
                >
                  <span>{option.face}</span>
                  <small>{option.label}</small>
                </button>
              ))}
            </div>
          </div>

          <div className="mood-question">
            <h2>How is your energy?</h2>
            <div className="energy-options">
              {(['low', 'steady', 'good'] as const).map((option) => (
                <button
                  aria-pressed={energy === option}
                  className={energy === option ? 'is-selected' : ''}
                  key={option}
                  onClick={() => setEnergy(option)}
                  type="button"
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          <label className="mood-note">
            <span>
              Anything on your mind? <small>Optional</small>
            </span>
            <textarea
              onChange={(event) => setNote(event.target.value)}
              placeholder="Add a short note…"
              rows={3}
              value={note}
            />
          </label>

          {message && <p className="mood-message">{message}</p>}
          <button
            className="button button--blue"
            disabled={isPending}
            onClick={saveMood}
            type="button"
          >
            {isPending ? 'Saving…' : 'Save today’s mood'} <ArrowIcon />
          </button>
        </section>
      </section>
    </main>
  )
}

function Home({
  moodEntries,
  name,
  onMood,
  onProfile,
  onReminders,
  onTrack,
}: {
  moodEntries: MoodEntryView[]
  name: string
  onMood: () => void
  onProfile: () => void
  onReminders: () => void
  onTrack: () => void
}) {
  const [selectedMetric, setSelectedMetric] = useState<HealthMetric>('weight')
  const [detailMetric, setDetailMetric] = useState<HealthMetric | null>(null)
  const today = new Intl.DateTimeFormat('en', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  }).format(new Date())
  const healthData = {
    weight: {
      label: 'Weight',
      value: '72.4',
      unit: 'kg',
      note: '0.2 kg lower',
      points: '0,33 18,27 36,29 54,19 72,22 90,12 108,15 126,8',
    },
    pressure: {
      label: 'Blood pressure',
      value: '124/78',
      unit: 'mmHg',
      note: 'Within your range',
      points: '0,28 18,17 36,24 54,12 72,25 90,18 108,22 126,13',
    },
    pulse: {
      label: 'Pulse',
      value: '72',
      unit: 'bpm',
      note: 'Resting average',
      points: '0,30 18,29 28,12 38,34 49,19 62,22 74,10 88,30 108,22 126,24',
    },
  }
  const activeData = healthData[selectedMetric]
  const initials = name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
  const history = {
    weight: ['72.8', '72.6', '72.7', '72.5', '72.5', '72.3', '72.4'],
    pressure: ['126/80', '122/79', '128/82', '124/78', '121/77', '125/80', '124/78'],
    pulse: ['74', '71', '73', '70', '75', '72', '72'],
  }
  const recentMoodDays = Array.from({ length: 7 }, (_, index) => {
    const date = new Date()
    date.setDate(date.getDate() - (6 - index))
    const key = localDateKey(date)
    return moodEntries.find((entry) => entry.date.slice(0, 10) === key)
  })

  return (
    <main className="home">
      <header className="home__header">
        <Brand />
        <button aria-label="View profile" className="avatar" onClick={onProfile} type="button">
          {initials}
        </button>
      </header>

      <section className="home__body">
        <div className="home__greeting">
          <p>{today}</p>
          <h1>Good morning, {name.split(' ')[0]}.</h1>
          <span>Every treatment is a step toward a stronger tomorrow.</span>
        </div>

        <button className="treatment-card" onClick={onTrack} type="button">
          <span className="treatment-card__top">
            <span className="treatment-card__icon">
              <DropIcon size={34} />
            </span>
            <span className="treatment-card__status">TODAY’S TREATMENT</span>
          </span>
          <span className="treatment-card__title">Track treatment</span>
          <span className="treatment-card__description">
            Start a new session and record how it goes.
          </span>
          <span className="treatment-card__action">
            <span>Start tracking</span>
            <span className="treatment-card__arrow">
              <ArrowIcon />
            </span>
          </span>
        </button>

        <section className="health-log">
          <div className="health-log__header">
            <div>
              <p>HEALTH LOG</p>
              <h2>Your trends</h2>
            </div>
            <span>Last 7 sessions</span>
          </div>

          <div className="metric-tabs" aria-label="Treatment health data">
            {(Object.keys(healthData) as HealthMetric[]).map((metric) => (
              <button
                className={`metric-tab metric-tab--${metric} ${
                  selectedMetric === metric ? 'is-active' : ''
                }`}
                key={metric}
                onClick={() => {
                  setSelectedMetric(metric)
                  setDetailMetric(metric)
                }}
                type="button"
              >
                <span>{healthData[metric].label}</span>
                <svg aria-hidden="true" viewBox="0 0 60 20">
                  <polyline points={healthData[metric].points} />
                </svg>
              </button>
            ))}
          </div>
        </section>

        <div className="care-actions">
          <button className="care-action care-action--medication" onClick={onMood} type="button">
            <span className="care-action__heading">
              <strong>Mood tracker</strong>
              <span>This week</span>
            </span>
            <span className="habit-grid mood-preview" aria-label="Recent moods">
              {recentMoodDays.map((entry, index) => (
                <i
                  className={`habit-day ${entry ? `is-${entry.energy}` : ''}`}
                  key={`${entry?.id ?? 'empty'}-${index}`}
                >
                  {moodOptions.find((option) => option.id === entry?.mood)?.face}
                </i>
              ))}
            </span>
          </button>
          <button className="care-action care-action--reminder" onClick={onReminders} type="button">
            <span className="care-action__heading">
              <strong>Reminders</strong>
              <span>Treatment</span>
            </span>
            <span className="reminder-list" aria-hidden="true">
              <i>
                <b />
                <em />
              </i>
              <i>
                <b />
                <em />
              </i>
              <i>
                <b />
                <em />
              </i>
            </span>
          </button>
          <button className="care-action care-action--other" type="button">
            <span className="care-action__icon">
              <Icon>
                <circle cx="5" cy="12" fill="currentColor" r="1.5" />
                <circle cx="12" cy="12" fill="currentColor" r="1.5" />
                <circle cx="19" cy="12" fill="currentColor" r="1.5" />
              </Icon>
            </span>
            <strong>Other</strong>
            <span>More tools</span>
          </button>
        </div>
      </section>

      {detailMetric && (
        <section
          aria-labelledby="health-detail-title"
          aria-modal="true"
          className={`health-modal health-modal--${detailMetric}`}
          role="dialog"
        >
          <div className="health-modal__header">
            <div>
              <p>HEALTH LOG</p>
              <h2 id="health-detail-title">{activeData.label}</h2>
            </div>
            <button
              aria-label="Close health details"
              className="icon-button"
              onClick={() => setDetailMetric(null)}
              type="button"
            >
              <Icon>
                <path
                  d="m6 6 12 12M18 6 6 18"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeWidth="1.8"
                />
              </Icon>
            </button>
          </div>
          <div className="health-modal__reading">
            <span>Latest reading</span>
            <strong>
              {activeData.value} <small>{activeData.unit}</small>
            </strong>
            <p>{activeData.note}</p>
          </div>
          <svg aria-hidden="true" className="health-modal__chart" viewBox="0 0 126 42">
            <path d="M0 40H126" />
            <polyline points={activeData.points} />
          </svg>
          <div className="health-modal__history">
            <span>Recent sessions</span>
            {history[detailMetric].map((reading, index) => (
              <div key={`${reading}-${index}`}>
                <span>Session {7 - index}</span>
                <strong>
                  {reading} <small>{activeData.unit}</small>
                </strong>
              </div>
            ))}
          </div>
        </section>
      )}
    </main>
  )
}

export default function App({
  initialEmergencyContacts,
  initialMoodEntries,
  initialPlan,
  initialUser,
}: {
  initialEmergencyContacts: EmergencyContactView[]
  initialMoodEntries: MoodEntryView[]
  initialPlan: PlanView | null
  initialUser: AppUserView | null
}) {
  const [user, setUser] = useState<AppUserView | null>(initialUser)
  const [contacts, setContacts] = useState<EmergencyContactView[]>(initialEmergencyContacts)
  const [moodEntries, setMoodEntries] = useState<MoodEntryView[]>(initialMoodEntries)
  const [plan, setPlan] = useState<PlanView | null>(initialPlan)
  const [screen, setScreen] = useState<Screen>(initialUser ? 'home' : 'welcome')
  const [authMode, setAuthMode] = useState<AuthMode>('create')
  const [treatmentKind, setTreatmentKind] = useState<TreatmentKind>('green')

  if (screen === 'welcome') {
    return (
      <Welcome
        onContinue={() => {
          setAuthMode('create')
          setScreen('auth')
        }}
        onLogin={() => {
          setAuthMode('login')
          setScreen('auth')
        }}
      />
    )
  }

  if (screen === 'auth') {
    return (
      <Auth
        initialMode={authMode}
        onBack={() => setScreen('welcome')}
        onSuccess={(authenticatedUser) => {
          setUser(authenticatedUser)
          setScreen('home')
        }}
      />
    )
  }

  if (screen === 'treatment') {
    return (
      <TreatmentMenu
        onBack={() => setScreen('home')}
        onSelect={(kind) => {
          setTreatmentKind(kind)
          setScreen('treatment-form')
        }}
      />
    )
  }

  if (screen === 'treatment-form') {
    return (
      <TreatmentForm
        kind={treatmentKind}
        onBack={() => setScreen('treatment')}
        onSave={() => setScreen('home')}
      />
    )
  }

  if (screen === 'profile' && user) {
    return (
      <Profile
        onBack={() => setScreen('home')}
        onEmergency={() => setScreen('emergency')}
        onLogout={() => {
          setUser(null)
          setScreen('welcome')
        }}
        onPrivacy={() => setScreen('privacy')}
        onSettings={() => setScreen('settings')}
        onUserChange={setUser}
        user={user}
      />
    )
  }

  if (screen === 'reminders' && user) {
    return (
      <Reminders
        initialPlan={plan}
        notificationsEnabled={user.notificationsEnabled ?? true}
        onBack={() => setScreen('home')}
        onPlanChange={setPlan}
      />
    )
  }

  if (screen === 'mood' && user) {
    return (
      <MoodTracker
        initialEntries={moodEntries}
        onBack={() => setScreen('home')}
        onEntriesChange={setMoodEntries}
      />
    )
  }

  if (screen === 'settings' && user) {
    return <Settings onBack={() => setScreen('profile')} onUserChange={setUser} user={user} />
  }

  if (screen === 'privacy' && user) {
    return (
      <Privacy
        onBack={() => setScreen('profile')}
        onCleared={() => {
          setContacts([])
          setMoodEntries([])
          setPlan(null)
          setUser({
            ...user,
            dateOfBirth: null,
            healthcareProvider: null,
            notificationsEnabled: false,
          })
        }}
      />
    )
  }

  if (screen === 'emergency' && user) {
    return (
      <EmergencyContacts
        initialContacts={contacts}
        onBack={() => setScreen('profile')}
        onContactsChange={setContacts}
      />
    )
  }

  return (
    <Home
      moodEntries={moodEntries}
      name={user?.name ?? 'Alex'}
      onMood={() => setScreen('mood')}
      onProfile={() => setScreen('profile')}
      onReminders={() => setScreen('reminders')}
      onTrack={() => setScreen('treatment')}
    />
  )
}
