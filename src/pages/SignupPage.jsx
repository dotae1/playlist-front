import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { sendVerificationMail, verifyMailCode, join } from '../api/authApi';
import styles from './AuthPage.module.css';

const INITIAL_FORM = {
  loginId: '',
  email: '',
  name: '',
  nickname: '',
  password: '',
  passwordConfirm: '',
  gender: '',
  age: '',
};

export default function SignupPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: 이메일 인증, 2: 정보 입력
  const [form, setForm] = useState(INITIAL_FORM);
  const [code, setCode] = useState('');
  const [mailSent, setMailSent] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSendMail = async () => {
    if (!form.email) { setError('이메일을 입력해주세요.'); return; }
    setError(null);
    setSuccessMsg(null);
    setLoading(true);
    try {
      await sendVerificationMail(form.email);
      setMailSent(true);
      setSuccessMsg('인증 코드가 이메일로 발송되었습니다.');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    if (!code) { setError('인증 코드를 입력해주세요.'); return; }
    setError(null);
    setSuccessMsg(null);
    setLoading(true);
    try {
      await verifyMailCode(form.email, code);
      setEmailVerified(true);
      setSuccessMsg('이메일 인증이 완료되었습니다.');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleNextStep = () => {
    if (!emailVerified) { setError('이메일 인증을 완료해주세요.'); return; }
    setError(null);
    setSuccessMsg(null);
    setStep(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.passwordConfirm) {
      setError('비밀번호가 일치하지 않습니다.');
      return;
    }
    setError(null);
    setLoading(true);
    try {
      await join({
        loginId: form.loginId,
        email: form.email,
        name: form.name,
        nickname: form.nickname,
        password: form.password,
        gender: form.gender || null,
        age: form.age,
      });
      navigate('/login', { state: { signupSuccess: true } });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.root}>
      <div className={styles.bg} />
      <div className={styles.orb1} />
      <div className={styles.orb2} />

      <div className={styles.container}>
        <div className={styles.logoArea}>
          <Link to="/" className={styles.logo}>AI Playlist</Link>
          <p className={styles.logoSub}>Gemini AI × Spotify</p>
        </div>

        <div className={styles.card}>
          <h1 className={styles.title}>회원가입</h1>

          {/* 진행 단계 */}
          <div className={styles.steps}>
            <div className={`${styles.step} ${step >= 1 ? styles.stepActive : ''} ${step > 1 ? styles.stepDone : ''}`}>
              <div className={styles.stepNum}>{step > 1 ? '✓' : '1'}</div>
              <span>이메일 인증</span>
            </div>
            <div className={styles.stepLine} />
            <div className={`${styles.step} ${step >= 2 ? styles.stepActive : ''}`}>
              <div className={styles.stepNum}>2</div>
              <span>정보 입력</span>
            </div>
          </div>

          {/* STEP 1 */}
          {step === 1 && (
            <div className={styles.form}>
              <div className={styles.field}>
                <label className={styles.label}>이메일</label>
                <div className={styles.inputRow}>
                  <input
                    className={styles.input}
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="example@email.com"
                    disabled={emailVerified}
                  />
                  <button
                    type="button"
                    className={styles.inlineBtn}
                    onClick={handleSendMail}
                    disabled={loading || emailVerified}
                  >
                    {mailSent ? '재발송' : '발송'}
                  </button>
                </div>
              </div>

              {mailSent && !emailVerified && (
                <div className={styles.field}>
                  <label className={styles.label}>인증 코드</label>
                  <div className={styles.inputRow}>
                    <input
                      className={styles.input}
                      type="text"
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                      placeholder="6자리 코드 입력"
                      maxLength={6}
                    />
                    <button
                      type="button"
                      className={styles.inlineBtn}
                      onClick={handleVerifyCode}
                      disabled={loading}
                    >
                      확인
                    </button>
                  </div>
                </div>
              )}

              {emailVerified && (
                <div className={styles.verifiedBadge}>
                  ✓ 이메일 인증 완료
                </div>
              )}

              {successMsg && <div className={styles.success}>{successMsg}</div>}
              {error && <div className={styles.error}><span>⚠</span> {error}</div>}

              <button
                type="button"
                className={styles.submitBtn}
                onClick={handleNextStep}
                disabled={!emailVerified}
              >
                다음 단계
              </button>
            </div>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.fieldGrid}>
                <div className={styles.field}>
                  <label className={styles.label}>아이디 <span className={styles.required}>*</span></label>
                  <input className={styles.input} type="text" name="loginId" value={form.loginId} onChange={handleChange} placeholder="영문, 숫자 조합" required />
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>이름 <span className={styles.required}>*</span></label>
                  <input className={styles.input} type="text" name="name" value={form.name} onChange={handleChange} placeholder="실명" required />
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>닉네임 <span className={styles.required}>*</span></label>
                  <input className={styles.input} type="text" name="nickname" value={form.nickname} onChange={handleChange} placeholder="닉네임" required />
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>나이</label>
                  <input className={styles.input} type="number" name="age" value={form.age} onChange={handleChange} placeholder="나이 (선택)" min="0" max="150" />
                </div>
              </div>

              <div className={styles.field}>
                <label className={styles.label}>성별</label>
                <div className={styles.genderRow}>
                  {[{ value: 'MAN', label: '남성' }, { value: 'WOMAN', label: '여성' }].map(({ value, label }) => (
                    <button
                      key={value}
                      type="button"
                      className={`${styles.genderBtn} ${form.gender === value ? styles.genderBtnActive : ''}`}
                      onClick={() => setForm((prev) => ({ ...prev, gender: prev.gender === value ? '' : value }))}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              <div className={styles.field}>
                <label className={styles.label}>비밀번호 <span className={styles.required}>*</span></label>
                <input className={styles.input} type="password" name="password" value={form.password} onChange={handleChange} placeholder="비밀번호" required autoComplete="new-password" />
              </div>

              <div className={styles.field}>
                <label className={styles.label}>비밀번호 확인 <span className={styles.required}>*</span></label>
                <input className={styles.input} type="password" name="passwordConfirm" value={form.passwordConfirm} onChange={handleChange} placeholder="비밀번호를 다시 입력하세요" required autoComplete="new-password" />
              </div>

              {error && <div className={styles.error}><span>⚠</span> {error}</div>}

              <div className={styles.btnRow}>
                <button type="button" className={styles.backBtn} onClick={() => { setStep(1); setError(null); }}>
                  이전
                </button>
                <button type="submit" className={styles.submitBtn} disabled={loading}>
                  {loading ? '가입 중...' : '가입하기'}
                </button>
              </div>
            </form>
          )}

          <p className={styles.switchText}>
            이미 계정이 있으신가요?{' '}
            <Link to="/login" className={styles.switchLink}>로그인</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
