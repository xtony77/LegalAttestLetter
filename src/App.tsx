import { useRef, useState } from 'react';
import { PersonSection } from './components/PersonSection';
import type { PersonData, PersonSectionErrors } from './components/PersonSection';
import {
  FontLoadError,
} from './lib/fontLoader';
import {
  generateAndDownloadLegalAttestLetterPdf,
  PdfGenerationError,
} from './lib/pdfGenerator';

const ScaleIcon = () => (
  <svg
    className="w-8 h-8 text-accent"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"
    />
  </svg>
);

const Header = () => (
  <header className="flex flex-col items-center gap-2 mb-8">
    <ScaleIcon />
    <h1 className="text-3xl font-bold text-primary tracking-tight text-center">
      台灣存證信函產生器
    </h1>
  </header>
);

const RocketIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
    <path d="M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
    <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 3 0 3 0" />
    <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-3 0-3" />
  </svg>
);

const GitHubIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 16 16"
    fill="#24292f"
    aria-hidden="true"
  >
    <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
  </svg>
);

const Footer = () => (
  <footer className="mt-8 text-center text-sm text-text-muted">
    <p className="inline-flex items-center gap-1 flex-wrap justify-center">
      <RocketIcon className="w-4 h-4" />
      <span>您的資料不會離開瀏覽器</span>
      <span className="mx-1">·</span>
      <a
        href="https://github.com/xtony77/LegalAttestLetter/issues"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1 hover:text-primary transition-colors"
      >
        <GitHubIcon className="w-4 h-4" />
        問題回報
      </a>
    </p>
  </footer>
);

function App() {
  const [senders, setSenders] = useState<PersonData[]>([{ name: '', address: '' }]);
  const [receivers, setReceivers] = useState<PersonData[]>([{ name: '', address: '' }]);
  const [copyReceivers, setCopyReceivers] = useState<PersonData[]>([]);
  const [content, setContent] = useState('');

  const [senderErrors, setSenderErrors] = useState<PersonSectionErrors>({});
  const [receiverErrors, setReceiverErrors] = useState<PersonSectionErrors>({});
  const [copyReceiverErrors, setCopyReceiverErrors] = useState<PersonSectionErrors>({});
  const [contentError, setContentError] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationError, setGenerationError] = useState('');

  const formRef = useRef<HTMLFormElement>(null);

  const validate = () => {
    let isValid = true;
    const newSenderErrors: PersonSectionErrors = {};
    const newReceiverErrors: PersonSectionErrors = {};
    const newCopyReceiverErrors: PersonSectionErrors = {};
    let newContentError = '';

    // 驗證寄件人
    senders.forEach((sender, index) => {
      if (!sender.name.trim() || !sender.address.trim()) {
        newSenderErrors[index] = {
          name: !sender.name.trim() ? '請輸入寄件人姓名' : undefined,
          address: !sender.address.trim() ? '請輸入寄件人地址' : undefined,
        };
        isValid = false;
      }
    });

    // 驗證收件人
    receivers.forEach((receiver, index) => {
      if (!receiver.name.trim() || !receiver.address.trim()) {
        newReceiverErrors[index] = {
          name: !receiver.name.trim() ? '請輸入收件人姓名' : undefined,
          address: !receiver.address.trim() ? '請輸入收件人地址' : undefined,
        };
        isValid = false;
      }
    });

    // 驗證副本收件人 (有新增則必須完整填寫)
    copyReceivers.forEach((copy, index) => {
      if (!copy.name.trim() || !copy.address.trim()) {
        newCopyReceiverErrors[index] = {
          name: !copy.name.trim() ? '請輸入副本收件人姓名' : undefined,
          address: !copy.address.trim() ? '請輸入副本收件人地址' : undefined,
        };
        isValid = false;
      }
    });

    // 驗證內文
    if (!content.trim()) {
      newContentError = '請輸入存證信函內文';
      isValid = false;
    }

    setSenderErrors(newSenderErrors);
    setReceiverErrors(newReceiverErrors);
    setCopyReceiverErrors(newCopyReceiverErrors);
    setContentError(newContentError);

    if (!isValid) {
      setTimeout(() => {
        const firstError = document.querySelector('.text-error');
        if (firstError) {
          firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 100);
    }

    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    setGenerationError('');
    setIsGenerating(true);

    try {
      await generateAndDownloadLegalAttestLetterPdf({
        senders,
        receivers,
        copyReceivers,
        content,
      });
    } catch (error) {
      if (error instanceof PdfGenerationError || error instanceof FontLoadError) {
        setGenerationError(error.message);
      } else {
        setGenerationError('PDF 產生失敗，請稍後再試');
      }
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-8 flex justify-center">
      <main className="w-full max-w-[720px] bg-surface shadow-lg rounded-xl p-6 md:p-10">
        <Header />
        
        <form ref={formRef} onSubmit={handleSubmit} className="space-y-10" noValidate>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <PersonSection
              title="寄件人區塊"
              persons={senders}
              onPersonsChange={setSenders}
              minCount={1}
              errors={senderErrors}
            />
            <PersonSection
              title="收件人區塊"
              persons={receivers}
              onPersonsChange={setReceivers}
              minCount={1}
              errors={receiverErrors}
            />
          </div>

          <PersonSection
            title="副本收件人區塊"
            persons={copyReceivers}
            onPersonsChange={setCopyReceivers}
            minCount={0}
            errors={copyReceiverErrors}
          />

          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-primary border-b border-primary/20 pb-2">
              信函內文
            </h2>
            <div>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="請輸入存證信函內文..."
                className={`w-full h-64 p-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all resize-none ${
                  contentError ? 'border-error ring-1 ring-error/50' : 'border-gray-300'
                }`}
              />
              {contentError && <p className="mt-1 text-sm text-error">{contentError}</p>}
            </div>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={isGenerating}
              className="w-full py-4 bg-primary text-white font-bold rounded-lg shadow-md hover:bg-primary/90 hover:shadow-lg active:scale-[0.98] transition-all relative overflow-hidden group disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:bg-primary disabled:hover:shadow-md disabled:active:scale-100"
            >
              <div className="absolute inset-0 bg-accent/10 translate-y-full group-hover:translate-y-0 transition-transform" />
              <span className="relative">{isGenerating ? '產生中...' : '產生存證信函 PDF'}</span>
            </button>
            {generationError && <p className="mt-3 text-sm text-error">{generationError}</p>}
          </div>
        </form>

        <Footer />
      </main>
    </div>
  )
}

export default App
