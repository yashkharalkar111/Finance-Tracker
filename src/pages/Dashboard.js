import Navbar from '../components/navbar';
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import AddTransactionModal from '../components/AddTransactionModal';
import AddIncomeModal from '../components/AddIncomeModal';
import SetReminderModal from '../components/SetReminderModal';
import AOS from 'aos';
import 'aos/dist/aos.css';

function Dashboard() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [budgetGoal, setBudgetGoal] = useState(5000);
  const [editingGoal, setEditingGoal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showAll, setShowAll] = useState(false);

  const [totalBalance, setTotalBalance] = useState(0);
  const [income, setIncome] = useState(0);
  const [expenses, setExpenses] = useState(0);
  const [transactions, setTransactions] = useState([]);

  const [activeModal, setActiveModal] = useState(null);

  const transactionRef = useRef();
  const incomeRef = useRef();
  const reminderRef = useRef();

  const categories = [
    'All', 'Electricity', 'Mobile', 'Internet', 'Water',
    'Gas', 'Credit Card', 'Rent', 'Insurance'
  ];

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/auth/user', {
          credentials: 'include',
        });
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);

          const txnRes = await fetch('http://localhost:5000/api/transactions/all', {
            credentials: 'include',
          });

          if (txnRes.ok) {
            const txns = await txnRes.json();
            setTransactions(txns);

            let totalIncome = 0;
            let totalExpense = 0;

            txns.forEach((txn) => {
              if (txn.type === 'income') totalIncome += txn.amount;
              else totalExpense += txn.amount;
            });

            setIncome(totalIncome);
            setExpenses(totalExpense);
            setTotalBalance(totalIncome - totalExpense);
          }
        } else {
          navigate('/login');
        }
      } catch {
        navigate('/login');
      }
    };

    checkAuth();
  }, []);

  useEffect(() => {
    AOS.init({ duration: 1000, once: false, mirror: true });
  }, []);

  const toggleTip = () => {
    const tip = document.getElementById('ai-tip-text');
    if (tip) {
      tip.style.display = tip.style.display === 'none' ? 'block' : 'none';
    }
  };

  const searchTransaction = () => {
    const input = document.getElementById('searchInput').value.toLowerCase();
    const items = document.querySelectorAll('.transactions li');
    items.forEach(item => {
      const text = item.textContent.toLowerCase();
      item.style.display = text.includes(input) ? 'flex' : 'none';
    });
  };

  const filteredTransactions = transactions.filter(txn =>
    selectedCategory === 'All' || txn.label === selectedCategory
  );

  const displayedTransactions = showAll
    ? filteredTransactions
    : filteredTransactions.slice(0, 4);

  const budgetUsed = ((expenses / budgetGoal) * 100).toFixed(0);
  const isOverBudget = expenses > budgetGoal;

  useEffect(() => {
    const handleOutsideClickOrScroll = (e) => {
      if (
        activeModal === 'transaction' &&
        transactionRef.current &&
        !transactionRef.current.contains(e.target)
      ) {
        setActiveModal(null);
      }
      if (
        activeModal === 'income' &&
        incomeRef.current &&
        !incomeRef.current.contains(e.target)
      ) {
        setActiveModal(null);
      }
      if (
        activeModal === 'reminder' &&
        reminderRef.current &&
        !reminderRef.current.contains(e.target)
      ) {
        setActiveModal(null);
      }
    };

    document.addEventListener('mousedown', handleOutsideClickOrScroll);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClickOrScroll);
    };
  }, [activeModal]);

  return (
    <>
      <Navbar />
      <main className="page-content">
        <div className="dashboard">
          <div className="top-bar" data-aos="fade-down">
            <h2>
              Hi <strong style={{ color: '#2c3e50' }}>{user?.name || 'User'}</strong>, you're logged in
            </h2>
          </div>

          <div className="snapshot" data-aos="fade-down">
            <div className="box">
              <h3>Total Balance</h3>₹ {totalBalance}
            </div>
            <div className="box">
              <h3>Income</h3>₹ {income}
            </div>
            <div className="box">
              <h3>Expenses</h3>₹ {expenses}
            </div>
          </div>

          <div className="tip" onClick={toggleTip} data-aos="fade-left">
            <span>💡 Smart AI Tip</span>
            <span>➤</span>
          </div>
          <div id="ai-tip-text" className="tip-text" style={{ display: 'none' }}>
            Track daily expenses to better manage your budget goals!
          </div>

          <div className="budget" data-aos="zoom-in-up">
            <strong>🎯 Budget Goal</strong>
            <div>
              ₹{expenses} of&nbsp;
              {editingGoal ? (
                <input
                  type="number"
                  value={budgetGoal}
                  onChange={(e) => setBudgetGoal(Number(e.target.value))}
                  onBlur={() => setEditingGoal(false)}
                  autoFocus
                  style={{ width: '80px' }}
                />
              ) : (
                <span
                  onClick={() => setEditingGoal(true)}
                  style={{ textDecoration: 'underline', cursor: 'pointer' }}
                >
                  ₹{budgetGoal}
                </span>
              )}
              &nbsp;({Math.min(budgetUsed, 100)}%)
            </div>
            <div className="budget-bar" data-aos="fade-down">
              <div
                className="budget-progress"
                style={{
                  width: `${Math.min(budgetUsed, 100)}%`,
                  backgroundColor: isOverBudget ? '#dc3545' : '#64748b',
                }}
              ></div>
            </div>
          </div>

          <div className="filter-row" data-aos="fade-down">
            <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            <input type="text" placeholder="Search" id="searchInput" />
            <button onClick={searchTransaction}>Search</button>
          </div>

          <div className="transactions" id="transactionList">
            <ul>
              {displayedTransactions.map((txn, index) => (
                <li key={index}>
                  <span>{txn.icon} {txn.label}</span>
                  <span style={{ color: txn.type === 'expense' ? 'red' : 'green' }}>
                    {txn.type === 'expense' ? '-' : '+'} ₹{txn.amount}
                  </span>
                </li>
              ))}
            </ul>
            {filteredTransactions.length > 4 && (
              <button className="see-more" onClick={() => setShowAll(!showAll)}>
                {showAll ? 'Show Less' : 'See More'}
              </button>
            )}
          </div>

          <div className="quick-actions" data-aos="fade-up">
            <button onClick={() => setActiveModal('transaction')}>➕ Add Transaction</button>
            <button onClick={() => setActiveModal('reminder')}>🔔 Set Reminder</button>
            <button onClick={() => setActiveModal('income')}>💰 Add Income</button>
            <button onClick={() => alert('This feature is coming soon!')}>📄 Export PDF/CSV</button>
          </div>

          {activeModal === 'transaction' && (
            <div ref={transactionRef}>
              <AddTransactionModal
                onClose={() => setActiveModal(null)}
                onAdd={async (txn) => {
                  try {
                    const res = await fetch('http://localhost:5000/api/transactions/add', {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json',
                      },
                      credentials: 'include',
                      body: JSON.stringify(txn),
                    });

                    if (res.ok) {
                      const savedTxn = await res.json();
                      setTransactions(prev => [savedTxn, ...prev]);

                      if (savedTxn.type === 'income') {
                        setIncome(prev => prev + savedTxn.amount);
                        setTotalBalance(prev => prev + savedTxn.amount);
                      } else {
                        setExpenses(prev => prev + savedTxn.amount);
                        setTotalBalance(prev => prev - savedTxn.amount);
                      }
                    } else {
                      const errorData = await res.json();
                      alert(errorData.msg || 'Unauthorized or error saving transaction');
                    }
                  } catch (err) {
                    console.error('Transaction Save Error:', err);
                    alert('Failed to save transaction');
                  }
                }}
              />
            </div>
          )}

          {activeModal === 'income' && (
            <div ref={incomeRef}>
              <AddIncomeModal
                onClose={() => setActiveModal(null)}
                onAdd={(txn) => {
                  setIncome(income + txn.amount);
                  setTotalBalance(totalBalance + txn.amount);
                }}
              />
            </div>
          )}

          {activeModal === 'reminder' && (
            <div ref={reminderRef}>
              <SetReminderModal onClose={() => setActiveModal(null)} />
            </div>
          )}
        </div>
      </main>
    </>
  );
}

export default Dashboard;
