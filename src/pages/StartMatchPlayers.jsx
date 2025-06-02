import React, { useState, useEffect, Component } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import HeaderComponent from '../components/kumar/startMatchHeader';
import flag1 from '../assets/kumar/Netherland.png'; // Fallback flags, used only if team.flagUrl is unavailable
import flag2 from '../assets/kumar/ukraine.png';
import btnbg from '../assets/kumar/button.png';
import backButton from '../assets/kumar/right-chevron.png';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

// Error Boundary Component
class ErrorBoundary extends Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="text-white text-center p-4">
          <h1>Something went wrong.</h1>
          <p>{this.state.error?.message || 'Unknown error'}</p>
        </div>
      );
    }
    return this.props.children;
  }
}

function StartMatchPlayers({ initialTeamA, initialTeamB, origin, onMatchEnd }) {
  const location = useLocation();
  const navigate = useNavigate();

  // Extract all relevant data from location.state
  const originPage = location.state?.origin;
  const maxOvers = location.state?.overs;
  const teamA = location.state?.teamA; // Full team object with name, flagUrl, players
  const teamB = location.state?.teamB; // Full team object with name, flagUrl, players
  const selectedPlayersFromProps = location.state?.selectedPlayers || { left: [], right: [] };
  const groupIndex = location.state?.groupIndex;
  const phase = location.state?.phase;
  const matches = location.state?.matches;
  const teams = location.state?.teams;
  const groups = location.state?.groups;
  const currentPhase = location.state?.currentPhase;
  const currentGroupIndex = location.state?.currentGroupIndex;

  const [currentView, setCurrentView] = useState('toss');
  const [showThirdButtonOnly, setShowThirdButtonOnly] = useState(false);
  const [topPlays, setTopPlays] = useState([]);
  const [currentOverBalls, setCurrentOverBalls] = useState([]);
  const [pastOvers, setPastOvers] = useState([]);
  const [playerScore, setPlayerScore] = useState(0);
  const [outCount, setOutCount] = useState(0);
  const [opponentBallsFaced, setOpponentBallsFaced] = useState(0);
  const [validBalls, setValidBalls] = useState(0);
  const [overNumber, setOverNumber] = useState(1);
  const [striker, setStriker] = useState(null);
  const [nonStriker, setNonStriker] = useState(null);
  const [bowlerVisible, setBowlerVisible] = useState(false);
  const [selectedBowler, setSelectedBowler] = useState(null);
  const [showBowlerDropdown, setShowBowlerDropdown] = useState(false);
  const [showBatsmanDropdown, setShowBatsmanDropdown] = useState(false);
  const [showPastOvers, setShowPastOvers] = useState(false);
  const [selectedBatsmenIndices, setSelectedBatsmenIndices] = useState([]);
  const [isChasing, setIsChasing] = useState(false);
  const [targetScore, setTargetScore] = useState(0);
  const [batsmenScores, setBatsmenScores] = useState({});
  const [batsmenBalls, setBatsmenBalls] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState({ title: '', message: '' });
  const [gameFinished, setGameFinished] = useState(false);
  const [pendingWide, setPendingWide] = useState(false);
  const [pendingNoBall, setPendingNoBall] = useState(false);
  const [pendingOut, setPendingOut] = useState(false);
  const [activeLabel, setActiveLabel] = useState(null);
  const [activeNumber, setActiveNumber] = useState(null);
  const [showRunInfo, setShowRunInfo] = useState(false);
  // New states for NRR calculation
  const [firstInningsScore, setFirstInningsScore] = useState(0);
  const [firstInningsOvers, setFirstInningsOvers] = useState(0);
  const [firstInningsWickets, setFirstInningsWickets] = useState(0);
  const [secondInningsScore, setSecondInningsScore] = useState(0);
  const [secondInningsOvers, setSecondInningsOvers] = useState(0);
  const [secondInningsWickets, setSecondInningsWickets] = useState(0);

  // Dynamic player data based on props
  const [battingTeamPlayers, setBattingTeamPlayers] = useState([]);
  const [bowlingTeamPlayers, setBowlingTeamPlayers] = useState([]);

  useEffect(() => {
    // Validate required data
    if (!teamA || !teamB || !selectedPlayersFromProps.left || !selectedPlayersFromProps.right) {
      console.error("Missing match data in location state. Redirecting.");
      navigate('/', { state: { error: 'Missing team or player data. Please set up the match again.' } });
      return;
    }

    // Set batting and bowling teams based on isChasing
    if (!isChasing) {
      // First innings: Team A (left) bats, Team B (right) bowls
      setBattingTeamPlayers(
        selectedPlayersFromProps.left.map((player, index) => ({
          ...player,
          index: player.name + index // Use player.id if available for uniqueness
        }))
      );
      setBowlingTeamPlayers(
        selectedPlayersFromProps.right.map((player, index) => ({
          ...player,
          index: player.name + index
        }))
      );
    } else {
      // Second innings: Team B (right) bats, Team A (left) bowls
      setBattingTeamPlayers(
        selectedPlayersFromProps.right.map((player, index) => ({
          ...player,
          index: player.name + index
        }))
      );
      setBowlingTeamPlayers(
        selectedPlayersFromProps.left.map((player, index) => ({
          ...player,
          index: player.name + index
        }))
      );
    }
    // Reset selections when teams change
    setStriker(null);
    setNonStriker(null);
    setSelectedBowler(null);
    setSelectedBatsmenIndices([]);
    setBatsmenScores({});
    setBatsmenBalls({});
  }, [isChasing, selectedPlayersFromProps, teamA, teamB, navigate]);

  const displayModal = (title, message) => {
    setModalContent({ title, message });
    setShowModal(true);
  };

  const handleButtonClick = (view) => {
    setCurrentView(view);
    setShowThirdButtonOnly(view === 'start');
  };

  const goBack = () => {
    if (gameFinished && showModal) {
      return;
    }
    navigate(-1);
  };

  const updateBatsmanScore = (batsmanIndex, runs) => {
    setBatsmenScores((prev) => ({
      ...prev,
      [batsmanIndex]: (prev[batsmanIndex] || 0) + runs
    }));
  };

  const updateBatsmanBalls = (batsmanIndex) => {
    setBatsmenBalls((prev) => ({
      ...prev,
      [batsmanIndex]: (prev[batsmanIndex] || 0) + 1
    }));
  };

  const handleScoreButtonClick = (value, isLabel) => {
    if (gameFinished) return;

    if (isLabel) {
      setActiveNumber(null);
      setActiveLabel(value);
    } else {
      setActiveLabel(null);
      setActiveNumber(value);
    }

    if (pendingWide && !isLabel && typeof value === 'number') {
      setPlayerScore((prev) => prev + value + 1);
      setTopPlays((prev) => [...prev, `W+${value}`]);
      setCurrentOverBalls((prev) => [...prev, `W+${value}`]);
      if (striker) updateBatsmanScore(striker.index, value + 1);
      setPendingWide(false);
      return;
    }

    if (pendingNoBall && !isLabel && typeof value === 'number') {
      setPlayerScore((prev) => prev + value + 1);
      setTopPlays((prev) => [...prev, `NB+${value}`]);
      setCurrentOverBalls((prev) => [...prev, `NB+${value}`]);
      if (striker) updateBatsmanScore(striker.index, value + 1);
      setPendingNoBall(false);
      return;
    }

    const extraBalls = ['No-ball', 'Wide', 'No ball'];
    const playValue = typeof value === 'string' ? value.charAt(0) : value;

    if (isLabel) {
      if (value === 'Wide' || value === 'No-ball' || value === 'Leg By') {
        setShowRunInfo(true);
      } else {
        setShowRunInfo(false);
      }
      if (value === 'Six') {
        setPlayerScore((prev) => prev + 6);
        setTopPlays((prev) => [...prev, 6]);
        setCurrentOverBalls((prev) => [...prev, 6]);
        if (striker) updateBatsmanScore(striker.index, 6);
      } else if (value === 'Four') {
        setPlayerScore((prev) => prev + 4);
        setTopPlays((prev) => [...prev, 4]);
        setCurrentOverBalls((prev) => [...prev, 4]);
        if (striker) updateBatsmanScore(striker.index, 4);
      } else if (value === 'Wide') {
        setPendingWide(true);
        return;
      } else if (value === 'No-ball') {
        setPendingNoBall(true);
        return;
      } else if (value === 'Leg By') {
        setPlayerScore((prev) => prev + 1);
        setTopPlays((prev) => [...prev, 'leg']);
        setCurrentOverBalls((prev) => [...prev, 'leg']);
        if (striker) updateBatsmanScore(striker.index, 1);
      } else {
        setTopPlays((prev) => [...prev, playValue]);
        setCurrentOverBalls((prev) => [...prev, playValue]);
        if (value === 'OUT' || value === 'Wicket' || value === 'lbw') {
          setPendingOut(true);
          setShowBatsmanDropdown(true);
        }
      }

      if (!extraBalls.includes(value)) {
        setValidBalls((prev) => prev + 1);
        if (striker && value !== 'Wide' && value !== 'No-ball') {
          updateBatsmanBalls(striker.index);
        }
      }
    } else {
      setShowRunInfo(false);
      setActiveNumber(value);
      setActiveLabel(null);
      setPlayerScore((prev) => prev + value);
      setTopPlays((prev) => [...prev, value]);
      setCurrentOverBalls((prev) => [...prev, value]);
      setValidBalls((prev) => prev + 1);
      if (striker) {
        updateBatsmanScore(striker.index, value);
        updateBatsmanBalls(striker.index);
      }
      if (value % 2 !== 0) {
        const temp = striker;
        setStriker(nonStriker);
        setNonStriker(temp);
      }
    }
  };

  useEffect(() => {
    if (modalContent.title !== 'Match Result') return;

    const canvas = document.getElementById('matchResults');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width = canvas.width = canvas.offsetWidth;
    let height = canvas.height = canvas.offsetHeight;

    let fireworks = [];

    function randomColor() {
      return `hsl(${Math.floor(Math.random() * 360)}, 100%, 70%)`;
    }

    function createFirework(x, y) {
      const color = randomColor();
      const particles = [];
      const particleCount = 30;

      for (let i = 0; i < particleCount; i++) {
        const angle = (Math.PI * 2 * i) / particleCount;
        const speed = Math.random() * 1 + 0.5;
        particles.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          alpha: 1,
          color,
          size: Math.random() * 2 + 0.5,
        });
      }

      fireworks.push({ particles });
    }

    function launch() {
      createFirework(width / 2, height / 3);
      createFirework(width / 4, height / 1.8);
      createFirework((3 * width) / 4, height / 1.8);
    }

    const interval = setInterval(launch, 1500);
    update();

    function update() {
      ctx.clearRect(0, 0, width, height);

      fireworks.forEach(firework => {
        firework.particles.forEach(p => {
          p.x += p.vx;
          p.y += p.vy;
          p.alpha -= 0.005;

          ctx.globalAlpha = p.alpha;
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
        });

        firework.particles = firework.particles.filter(p => p.alpha > 0);
      });

      fireworks = fireworks.filter(f => f.particles.length > 0);
      ctx.globalAlpha = 1;
      requestAnimationFrame(update);
    }

    const resize = () => {
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };
    window.addEventListener('resize', resize);

    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', resize);
      fireworks = [];
      ctx.clearRect(0, 0, width, height);
    };
  }, [modalContent.title]);

  useEffect(() => {
    if (gameFinished) return;

    // Check for end of innings or match
    if (outCount >= 10 || (validBalls === 6 && overNumber > maxOvers - 1)) {
      if (!isChasing) {
        // Store first innings data for NRR calculation
        setFirstInningsScore(playerScore);
        setFirstInningsOvers(overNumber - 1 + validBalls / 6);
        setFirstInningsWickets(outCount);
        setTargetScore(playerScore + 1);
        setIsChasing(true);
        resetInnings();
        displayModal('Innings Break', `You need to chase ${playerScore + 1} runs`);
      } else {
        // Store second innings data
        setSecondInningsScore(playerScore);
        setSecondInningsOvers(overNumber - 1 + validBalls / 6);
        setSecondInningsWickets(outCount);

        let winnerTeamName = '';
        let loserTeamName = '';
        let message = '';
        if (playerScore < targetScore - 1) {
          winnerTeamName = teamA.name;
          loserTeamName = teamB.name;
          message = `${teamA.name} wins by ${targetScore - 1 - playerScore} runs!`;
        } else if (playerScore === targetScore - 1) {
          winnerTeamName = 'Tie';
          loserTeamName = null;
          message = 'Match tied!';
        } else {
          winnerTeamName = teamB.name;
          loserTeamName = teamA.name;
          message = `${teamB.name} wins!`;
        }

        // Calculate NRR
        // NRR = (Runs Scored / Overs Faced) - (Runs Conceded / Overs Bowled)
        const teamARunsScored = firstInningsScore;
        const teamARunsConceded = secondInningsScore;
        const teamAOversFaced = firstInningsOvers;
        const teamAOversBowled = secondInningsOvers;
        const teamBRunsScored = secondInningsScore;
        const teamBRunsConceded = firstInningsScore;
        const teamBOversFaced = secondInningsOvers;
        const teamBOversBowled = firstInningsOvers;

        const teamANRR = teamAOversFaced > 0 && teamBOversBowled > 0
          ? (teamARunsScored / teamAOversFaced) - (teamARunsConceded / teamBOversBowled)
          : 0;
        const teamBNRR = teamBOversFaced > 0 && teamAOversBowled > 0
          ? (teamBRunsScored / teamBOversFaced) - (teamBRunsConceded / teamAOversBowled)
          : 0;

        displayModal('Match Result', message);
        setGameFinished(true);

        // Store winner, loser, and NRR for navigation
        setModalContent(prev => ({
          ...prev,
          winnerTeamName,
          loserTeamName,
          teamANRR: teamANRR.toFixed(3),
          teamBNRR: teamBNRR.toFixed(3)
        }));
      }
      return;
    }

    // Check for target achieved during chasing
    if (isChasing && playerScore >= targetScore && targetScore > 0) {
      // Store second innings data
      setSecondInningsScore(playerScore);
      setSecondInningsOvers(overNumber - 1 + validBalls / 6);
      setSecondInningsWickets(outCount);

      let winnerTeamName = teamB.name;
      let loserTeamName = teamA.name;
      let message = `${teamB.name} wins!`;

      // Calculate NRR
      const teamARunsScored = firstInningsScore;
      const teamARunsConceded = secondInningsScore;
      const teamAOversFaced = firstInningsOvers;
      const teamAOversBowled = secondInningsOvers;
      const teamBRunsScored = secondInningsScore;
      const teamBRunsConceded = firstInningsScore;
      const teamBOversFaced = secondInningsOvers;
      const teamBOversBowled = firstInningsOvers;

      const teamANRR = teamAOversFaced > 0 && teamBOversBowled > 0
        ? (teamARunsScored / teamAOversFaced) - (teamARunsConceded / teamBOversBowled)
        : 0;
      const teamBNRR = teamBOversFaced > 0 && teamAOversBowled > 0
        ? (teamBRunsScored / teamBOversFaced) - (teamBRunsConceded / teamAOversBowled)
        : 0;

      displayModal('Match Result', message);
      setGameFinished(true);

      // Store winner, loser, and NRR for navigation
      setModalContent(prev => ({
        ...prev,
        winnerTeamName,
        loserTeamName,
        teamANRR: teamANRR.toFixed(3),
        teamBNRR: teamBNRR.toFixed(3)
      }));
      return;
    }

    // End of Over logic
    if (validBalls === 6) {
      setPastOvers((prev) => [...prev, currentOverBalls]);
      setCurrentOverBalls([]);
      setOverNumber((prev) => prev + 1);
      setValidBalls(0);
      const temp = striker;
      setStriker(nonStriker);
      setNonStriker(temp);
      displayModal('Over Finished', `Over ${overNumber} completed!`);
      setTimeout(() => {
        setShowBowlerDropdown(true);
      }, 1000);
    }
  }, [validBalls, currentOverBalls, nonStriker, overNumber, isChasing, targetScore, playerScore, gameFinished, outCount, maxOvers, teamA, teamB, firstInningsScore, firstInningsOvers, secondInningsScore, secondInningsOvers]);

  const resetInnings = () => {
    setCurrentOverBalls([]);
    setPastOvers([]);
    setPlayerScore(0);
    setOutCount(0);
    setValidBalls(0);
    setOverNumber(1);
    setStriker(null);
    setNonStriker(null);
    setSelectedBowler(null);
    setSelectedBatsmenIndices([]);
    setTopPlays([]);
    setBowlerVisible(false);
    setCurrentView('toss');
    setShowThirdButtonOnly(false);
    setBatsmenScores({});
    setBatsmenBalls({});
    setGameFinished(false);
    setPendingWide(false);
    setPendingNoBall(false);
    setPendingOut(false);
    setActiveLabel(null);
    setActiveNumber(null);
    setShowRunInfo(false);
  };

  const resetGame = () => {
    resetInnings();
    setIsChasing(false);
    setTargetScore(0);
    setFirstInningsScore(0);
    setFirstInningsOvers(0);
    setFirstInningsWickets(0);
    setSecondInningsScore(0);
    setSecondInningsOvers(0);
    setSecondInningsWickets(0);
  };

  const getStrikeRate = (batsmanIndex) => {
    const runs = batsmenScores[batsmanIndex] || 0;
    const balls = batsmenBalls[batsmanIndex] || 0;
    if (balls === 0) return 0;
    return ((runs / balls) * 100).toFixed(2);
  };

  const handlePlayerSelect = (player) => {
    if (!striker) {
      setStriker(player);
      setSelectedBatsmenIndices((prev) => [...prev, player.index]);
      setBatsmenScores((prev) => ({ ...prev, [player.index]: 0 }));
      setBatsmenBalls((prev) => ({ ...prev, [player.index]: 0 }));
    } else if (!nonStriker && striker.index !== player.index) {
      setNonStriker(player);
      setSelectedBatsmenIndices((prev) => [...prev, player.index]);
      setBatsmenScores((prev) => ({ ...prev, [player.index]: 0 }));
      setBatsmenBalls((prev) => ({ ...prev, [player.index]: 0 }));
    }
  };

  const handleBowlerSelect = (player) => {
    setSelectedBowler(player);
    setShowBowlerDropdown(false);
  };

  const handleBatsmanSelect = (player) => {
    setStriker(player);
    setSelectedBatsmenIndices((prev) => [...prev, player.index]);
    setShowBatsmanDropdown(false);
    setBatsmenScores((prev) => ({ ...prev, [player.index]: 0 }));
    setBatsmenBalls((prev) => ({ ...prev, [player.index]: 0 }));
    if (pendingOut) {
      setOutCount((prev) => prev + 1);
      setPendingOut(false);
    }
  };

  const getAvailableBatsmen = () => {
    return battingTeamPlayers.filter((player) => !selectedBatsmenIndices.includes(player.index));
  };

  const cancelStriker = () => {
    setSelectedBatsmenIndices((prev) => prev.filter((i) => i !== striker?.index));
    const newScores = { ...batsmenScores };
    delete newScores[striker?.index];
    setBatsmenScores(newScores);
    const newBalls = { ...batsmenBalls };
    delete newBalls[striker?.index];
    setBatsmenBalls(newBalls);
    setStriker(null);
  };

  const cancelNonStriker = () => {
    setSelectedBatsmenIndices((prev) => prev.filter((i) => i !== nonStriker?.index));
    const newScores = { ...batsmenScores };
    delete newScores[nonStriker?.index];
    setBatsmenScores(newScores);
    const newBalls = { ...batsmenBalls };
    delete newBalls[nonStriker?.index];
    setBatsmenBalls(newBalls);
    setNonStriker(null);
  };

  const cancelBatsmanDropdown = () => {
    setShowBatsmanDropdown(false);
    setPendingOut(false);
    setTopPlays((prev) => prev.slice(0, -1));
    setCurrentOverBalls((prev) => prev.slice(0, -1));
    setValidBalls((prev) => Math.max(0, prev - 1));
  };

  const handleModalOkClick = () => {
    setShowModal(false);

    if (gameFinished && modalContent.title === 'Match Result') {
      // Navigate to /start-match to play the next match with NRR and winner/loser
      navigate('/match-start', {
        state: {
          teams,
          groups,
          matches,
          currentPhase,
          currentGroupIndex,
          winner: modalContent.winnerTeamName,
          loser: modalContent.loserTeamName,
          teamANRR: parseFloat(modalContent.teamANRR),
          teamBNRR: parseFloat(modalContent.teamBNRR),
          origin: '/tournament-bracket', // Preserve origin for potential further navigation,
          activeTab: 'Start Match'
        }
      });
    } else if (modalContent.title === 'Innings Break') {
      resetInnings();
      setIsChasing(true);
      setBowlerVisible(false);
      setCurrentView('toss');
      setShowThirdButtonOnly(false);
    }
  };

  if (!teamA || !teamB || !selectedPlayersFromProps.left || !selectedPlayersFromProps.right) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <p className="text-xl">Loading team data...</p>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <section
        className="w-full flex flex-col items-center"
        style={{
          backgroundImage: 'linear-gradient(140deg,#080006 15%,#FF0077)',
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          minHeight: '100vh',
          overflow: 'hidden',
        }}
      >
        {HeaderComponent ? <HeaderComponent /> : <div className="text-white">Header Missing</div>}

        {currentView === 'toss' && !striker && !nonStriker && !bowlerVisible && !showThirdButtonOnly && (
          <button
            onClick={goBack}
            className="absolute left-4 top-24 md:left-10 md:top-32 z-10 w-10 h-10 flex items-center justify-center"
          >
            <img
              alt="Back"
              className="w-6 h-6 transform rotate-180 mb-5"
              src={backButton}
            />
          </button>
        )}

        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-[#4C0025] p-6 rounded-lg max-w-md w-full">
              {modalContent.title === 'Match Result' && (
                <DotLottieReact
                  src="https://lottie.host/42c7d544-9ec0-4aaf-895f-3471daa49e49/a5beFhswU6.lottie"
                  style={{
                    position: 'absolute',
                    left: '0%',
                    top: '0%',
                    width: '100%',
                    height: '100%',
                    zIndex: 0,
                    pointerEvents: 'none',
                  }}
                  loop
                  autoplay
                />
              )}

              <h3 className="text-white text-xl font-bold mb-4 relative z-10">{modalContent.title}</h3>
              <p className="text-white mb-6 relative z-10">{modalContent.message}</p>
              <div className="flex justify-center relative z-10">
                <button
                  onClick={handleModalOkClick}
                  className="w-40 h-12 bg-[#FF62A1] text-white font-bold text-lg rounded-lg border-2 border-white"
                >
                  OK
                </button>
              </div>
            </div>
          </div>
        )}

        {(currentView !== 'toss' || striker || nonStriker || bowlerVisible || showThirdButtonOnly) && (
          <button
            onClick={goBack}
            className="absolute left-4 top-24 md:left-10 md:top-32 z-10 w-10 h-10 flex items-center justify-center"
          >
            <img src={backButton} alt="Back" className="w-6 h-6 transform rotate-180 mb-5" onError={(e) => (e.target.src = '')} />
          </button>
        )}

        {!showThirdButtonOnly && (
          <div className=""></div>
        )}

        {currentView === 'toss' && !showThirdButtonOnly && (
          <>
            <div id="toss" className="text-center mb-4">
              <h2 className="text-white font-bold text-3xl md:text-[3rem] mt-20 md:mt-6">
                {bowlerVisible ? (isChasing ? teamA.name : teamB.name) : (isChasing ? teamB.name : teamA.name)}
              </h2>
              <h2 className="text-2xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-[#F0167C] to-white text-center">
                {bowlerVisible ? (isChasing ? 'Choose the bowler' : 'Choose the Bowler') : 'Select Batsmen'}
              </h2>
            </div>

            <div className="flex gap-4">
              {!bowlerVisible && (
                <>
                  <div>
                    <button className="w-28 h-12 text-white text-lg md:w-25 md:h-10 font-bold bg-gradient-to-l from-[#12BFA5] to-[#000000] rounded-[1rem] shadow-lg">
                      Striker
                    </button>
                    {striker && (
                      <div className="relative text-white text-center mt-2">
                        <div className="inline-block">
                          <img
                            src={striker.photoUrl}
                            alt="Striker"
                            className="w-20 h-20 md:w-10 md:h-10 lg:w-10 lg:h-10 rounded-full mx-auto object-cover aspect-square"
                            onError={(e) => (e.target.src = '')}
                          />
                          <button
                            onClick={cancelStriker}
                            className="absolute -top-2 right-4 w-6 h-6 text-white font-bold flex items-center justify-center text-xl"
                          >
                            ×
                          </button>
                        </div>
                        <div>{striker.name}</div>
                        <div className="text-sm">{striker.role}</div>
                      </div>
                    )}
                  </div>
                  <div>
                    <button className="w-28 h-12 text-white text-lg md:w-25 md:h-10 font-bold bg-gradient-to-l from-[#12BFA5] to-[#000000] rounded-[1rem] shadow-lg">
                      Non-Striker
                    </button>
                    {nonStriker && (
                      <div className="relative text-white text-center mt-2">
                        <div className="inline-block">
                          <img
                            src={nonStriker.photoUrl}
                            alt="Non-striker"
                            className="w-20 h-20 md:w-15 md:h-15 lg:w-10 lg:h-10 rounded-full mx-auto object-cover aspect-square"
                            onError={(e) => (e.target.src = '')}
                          />
                          <button
                            onClick={cancelNonStriker}
                            className="absolute -top-2 right-4 w-6 h-6 text-white font-bold flex items-center justify-center text-xl"
                          >
                            ×
                          </button>
                        </div>
                        <div>{nonStriker.name}</div>
                        <div className="text-sm">{nonStriker.role}</div>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>

            {!bowlerVisible && (striker === null || nonStriker === null) && (
              <div id="batsman-selection" className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
                {getAvailableBatsmen().map((player) => (
                  <div
                    key={player.index}
                    onClick={() => handlePlayerSelect(player)}
                    className={`cursor-pointer flex flex-col items-center text-white text-center ${selectedBatsmenIndices.includes(player.index) ? 'opacity-50' : ''}`}
                  >
                    <div className="w-20 h-20 md:w-15 md:h-15 lg:w-15 lg:h-15 rounded-full border-[5px] border-[#F0167C] overflow-hidden flex items-center justify-center aspect-square">
                      <img
                        src={player.photoUrl}
                        alt="Player"
                        className="w-full h-full object-cover aspect-square"
                        onError={(e) => (e.target.src = '')}
                      />
                    </div>
                    <span className="mt-2 font-bold text-lg">{player.name}</span>
                    <h2 className="text-sm font-light">{player.role}</h2>
                  </div>
                ))}
              </div>
            )}

            {striker && nonStriker && !bowlerVisible && (
              <button
                id="choosebowler"
                onClick={() => setBowlerVisible(true)}
                className="w-30 rounded-3xl h-10 mt-4 bg-black text-white text-sm font-bold shadow-lg bg-[url('../assets/kumar/button.png')] transform transition duration-200 hover:scale-105 hover:shadow-xl active:scale-95 active:shadow-md"
                style={{
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat',
                }}
              >
                Choose Bowler
              </button>
            )}

            {selectedBowler && (
              <div className="relative inline-block text-center text-white">
                <img
                  src={selectedBowler.photoUrl}
                  alt="Bowler"
                  className="w-20 h-20 md:w-15 md:h-15 lg:w-15 lg:h-15 rounded-full mx-auto object-cover aspect-square"
                  onError={(e) => (e.target.src = '')}
                />
                <div>{selectedBowler.name}</div>
                <div className="text-sm">{selectedBowler.role}</div>
              </div>
            )}

            {bowlerVisible && (
              <>
                <div id="bowler-selection" className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
                  {bowlingTeamPlayers.map((player) => (
                    <div
                      key={player.index}
                      onClick={() => handleBowlerSelect(player)}
                      className={`cursor-pointer flex flex-col items-center text-white text-center ${selectedBowler?.index === player.index ? 'opacity-50' : ''}`}
                    >
                      <div
                        className="w-20 h-20 md:w-15 md:h-15 lg:w-15 lg:h-15 rounded-full border-[5px] border-[#12BFA5] overflow-hidden flex items-center justify-center aspect-square"
                      >
                        <img
                          src={player.photoUrl}
                          alt="Player"
                          className="w-full h-full object-cover aspect-square"
                          onError={(e) => (e.target.src = '')}
                        />
                      </div>
                      <span className="mt-2 font-bold text-lg">{player.name}</span>
                      <h2 className="text-sm font-light">{player.role}</h2>
                    </div>
                  ))}
                </div>

                {selectedBowler && (
                  <button
                    onClick={() => handleButtonClick('start')}
                    className="w-30 h-10 mt-4 text-white text-lg font-bold rounded-3xl bg-black bg-[url('../assets/kumar/button.png')] bg-cover bg-center shadow-lg transform transition duration-200 hover:scale-105 hover:shadow-xl active:scale-95 active:shadow-md"
                  >
                    Let's Play
                  </button>
                )}
              </>
            )}
          </>
        )}

        {showThirdButtonOnly && (
          <div id="start" className="relative flex flex-col w-full h-full items-center px-4 mt-20 md:mt-10">
            <h2 className="gap-5 text-4xl md:text-3xl lg:text-5xl text-white font-bold text-center">Score Board</h2>
            <div className="mt-4 flex md:flex-row w-full md:w-1/2 justify-around gap-20 h-fit pt-2">
              <div className="flex items-center justify-center mb-4 md:mb-0">
                <img
                  src={isChasing ? teamB.flagUrl || flag2 : teamA.flagUrl || flag1}
                  className="w-16 h-16 md:w-30 md:h-30 aspect-square"
                  alt="Flag"
                  onError={(e) => (e.target.src = isChasing ? flag2 : flag1)}
                />
                <div className="ml-4 md:ml-10">
                  <h3 className="text-sm md:text-2xl md:text-3xl lg:text-4xl text-white font-bold text-center">
                    {playerScore} - {outCount}
                    <h2 className="text-base md:text-lg lg:text-xl">{overNumber > maxOvers ? maxOvers : overNumber - 1}.{validBalls}</h2>
                  </h3>
                </div>
              </div>
              <div className="flex items-center justify-center mb-4 md:mb-0">
                <div className="mr-4 md:mr-10">
                  <h3 className="text-lg md:text-2xl md:text-3xl lg:text-4xl text-white font-bold text-center text-yellow-300 underline">
                    {isChasing ? `Target: ${targetScore}` : 'Not yet'}
                  </h3>
                </div>
                <img
                  src={isChasing ? teamA.flagUrl || flag1 : teamB.flagUrl || flag2}
                  className="w-16 h-16 md:w-30 md:h-30 aspect-square"
                  alt="Flag"
                  onError={(e) => (e.target.src = isChasing ? flag1 : flag2)}
                />
              </div>
            </div>

            <div className="w-full flex flex-col md:justify-between md:flex-row md:w-[50%] justify-around mt-2 md:pr-15">
              <div className="flex flex-row px-[4.8%] md:p-0 justify-between md:flex-row md:items-center gap-4 md:gap-8 mb-4 md:mb-0">
                <div className="text-white text-center">
                  <h3 className={`text-lg md:text-xl font-bold ${striker ? 'text-yellow-300' : 'text-gray-400'}`}>Striker</h3>
                  {striker && (
                    <div className="flex flex-col items-center w-full">
                      <div className="font-bold text-sm md:text-base">{striker.name}</div>
                      <div className="text-xs md:text-sm">{striker.role}</div>
                      <div className="text-xs md:text-sm">
                        {batsmenScores[striker.index] || 0} ({batsmenBalls[striker.index] || 0})
                        <span className="text-yellow-300"> SR: {getStrikeRate(striker.index)}</span>
                      </div>
                    </div>
                  )}
                </div>
                <div className="hidden sm:block text-white text-center">
                  <h3 className={`text-lg md:text-xl font-bold ${!striker ? 'text-yellow-300' : 'text-gray-400'}`}>Non-Striker</h3>
                  {nonStriker && (
                    <div className="flex flex-col items-center w-full">
                      <div className="font-bold text-sm md:text-base">{nonStriker.name}</div>
                      <div className="text-xs md:text-sm">{nonStriker.role}</div>
                      <div className="text-xs md:text-sm">
                        {batsmenScores[nonStriker.index] || 0} ({batsmenBalls[nonStriker.index] || 0})
                        <span className="text-yellow-300"> SR: {getStrikeRate(nonStriker.index)}</span>
                      </div>
                    </div>
                  )}
                </div>
                <div className="sm:hidden text-white text-center md:ml-10">
                  <h3 className="text-lg md:text-xl font-bold">Bowler</h3>
                  {selectedBowler && (
                    <div className="flex flex-col items-center">
                      <div className="font-bold text-sm md:text-base">{selectedBowler.name}</div>
                      <div className="text-xs md:text-sm">{selectedBowler.role}</div>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex flex-col justify-center items-center w-full md:w-[20%] mb-4 md:mb-0">
                <div className="flex justify-center">
                  <button
                    onClick={() => setShowPastOvers(!showPastOvers)}
                    className="w-24 md:w-12 h-10 md:h-12 bg-[#4C0025] text-white font-bold text-sm md:text-lg rounded-lg border-2 border-white"
                  >
                    {showPastOvers ? 'Hide Overs' : 'Show Runs'}
                  </button>
                </div>
                {showPastOvers && (
                  <div className="mt-2 md:mt-4 text-white w-full">
                    <h3 className="text-lg md:text-xl font-bold mb-2 md:mb-4 text-center">Overs History</h3>
                    <div className="flex flex-wrap gap-2 md:gap-4 justify-center">
                      {pastOvers.map((over, index) => (
                        <div key={`completed-over-${index}`} className="bg-[#4C0025] p-2 md:p-3 rounded-lg">
                          <h4 className="text-sm md:text-base">Over {index + 1}:</h4>
                          <div className="flex gap-1 md:gap-2">
                            {over.map((ball, ballIndex) => (
                              <span
                                key={`completed-over-${index}-ball-${ballIndex}`}
                                className={`w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 flex items-center justify-center rounded-full text-xs md:text-sm ${ball === 'W' || ball === 'O' || ball === 'OUT' || ball === 'lbw' ? 'bg-red-600' : 'bg-[#FF62A1]'}`}
                              >
                                {ball}
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                      {currentOverBalls.length > 0 && (
                        <div key="current-over" className="bg-[#4C0025] p-2 md:p-3 rounded-lg">
                          <h4 className="text-sm md:text-base">Current Over ({pastOvers.length + 1}):</h4>
                          <div className="flex gap-1 md:gap-2">
                            {currentOverBalls.map((ball, ballIndex) => (
                              <span
                                key={`current-over-ball-${ballIndex}`}
                                className={`w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 flex items-center justify-center rounded-full text-xs md:text-sm ${ball === 'W' || ball === 'O' || ball === 'OUT' || ball === 'lbw' ? 'bg-red-600' : 'bg-[#FF62A1]'}`}
                              >
                                {ball}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
              <div className="hidden sm:block w-20 text-white text-center">
                <h3 className="text-lg md:text-xl font-bold">Bowler</h3>
                {selectedBowler && (
                  <div className="flex flex-col items-center">
                    <div className="font-bold text-sm md:text-base">{selectedBowler.name}</div>
                    <div className="text-xs md:text-sm">{selectedBowler.role}</div>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-4 flex flex-wrap justify-center gap-2 md:gap-4">
              {[0, 1, 2, 4, 6].map((num) => {
                const isActive = activeNumber === num;
                return (
                  <button
                    key={num}
                    onClick={() => handleScoreButtonClick(num)}
                    className={`w-12 h-12 md:w-14 md:h-14 lg:w-16 lg:h-16
                      ${isActive ? 'bg-green-500' : 'bg-[#4C0025] hover:bg-green-300'}
                      text-white font-bold text-lg md:text-xl rounded-full border-2 border-white
                      flex items-center justify-center transition-colors duration-300`}
                  >
                    {num}
                  </button>
                );
              })}
            </div>

            <div className="mt-2 flex flex-wrap justify-center gap-2 md:gap-4">
              {['Wide', 'No-ball', 'OUT', 'Leg By', 'lbw'].map((label) => {
                const isActive = activeLabel === label;
                return (
                  <button
                    key={label}
                    onClick={() => handleScoreButtonClick(label, true)}
                    className={`w-20 h-10 md:w-24 md:h-12
                      ${isActive ? 'bg-red-600' : 'bg-[#4C0025] hover:bg-red-400'}
                      text-white font-bold text-sm md:text-lg rounded-lg border-2 border-white
                      flex items-center justify-center transition-colors duration-300`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
            {showRunInfo && (
              <p className="text-yellow-300 text-sm mt-2 text-center font-medium">
                Please select run, if not select 0
              </p>
            )}

            {showBatsmanDropdown && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-[#4C0025] p-4 md:p-6 rounded-lg max-w-md w-full mx-4 relative">
                  <button
                    onClick={() => cancelBatsmanDropdown()}
                    className="absolute top-2 right-2 w-6 h-6 text-white font-bold flex items-center justify-center text-xl"
                  >
                    ×
                  </button>
                  <h3 className="text-white text-lg md:text-xl font-bold mb-4">Select Next Batsman</h3>
                  <div className="grid grid-cols-2 gap-2 md:gap-4">
                    {getAvailableBatsmen().map((player) => (
                      <div
                        key={player.index}
                        onClick={() => handleBatsmanSelect(player)}
                        className="cursor-pointer flex flex-col items-center text-white text-center p-2 hover:bg-[#FF62A1] rounded-lg"
                      >
                        <img
                          src={player.photoUrl}
                          alt="Player"
                          className="w-12 h-12 md:w-16 md:h-16 rounded-full object-cover aspect-square"
                          onError={(e) => (e.target.src = '')}
                        />
                        <span className="text-xs md:text-sm">{player.name}</span>
                        <span className="text-xs">{player.role}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {showBowlerDropdown && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-[#4C0025] p-4 md:p-6 rounded-lg max-w-md w-full mx-4 relative">
                  <button
                    onClick={() => setShowBowlerDropdown(false)}
                    className="absolute top-2 right-2 w-6 h-6 text-white font-bold flex items-center justify-center text-xl"
                  >
                    ×
                  </button>
                  <h3 className="text-white text-lg md:text-xl font-bold mb-4">Select Next Bowler</h3>
                  <div className="grid grid-cols-2 gap-2 md:gap-4">
                    {bowlingTeamPlayers
                      .filter((player) => player.index !== selectedBowler?.index)
                      .map((player) => (
                        <div
                          key={player.index}
                          onClick={() => handleBowlerSelect(player)}
                          className="cursor-pointer flex flex-col items-center text-white text-center p-2 hover:bg-[#FF62A1] rounded-lg"
                        >
                          <img
                            src={player.photoUrl}
                            alt="Player"
                            className="w-12 h-12 md:w-16 md:h-16 rounded-full object-cover aspect-square"
                            onError={(e) => (e.target.src = '')}
                          />
                          <span className="text-xs md:text-sm">{player.name}</span>
                          <span className="text-xs">{player.role}</span>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {currentView === 'startInnings' && !showThirdButtonOnly && (
          <div className="text-center text-white">
            <h2 className="text-4xl font-bold mb-6">Innings Break</h2>
            <div className="text-2xl mb-8">
              <p>First Innings Score: {playerScore}/{outCount}</p>
              <p>Overs: {overNumber - 1}</p>
            </div>
            <button
              onClick={() => {
                setIsChasing(true);
                setTargetScore(playerScore + 1);
                resetInnings();
                handleButtonClick('toss');
              }}
              className="w-40 h-14 text-white text-lg font-bold bg-[url('../assets/button.png')] bg-cover bg-center shadow-lg"
            >
              Start Chase
            </button>
          </div>
        )}
      </section>
    </ErrorBoundary>
  );
}

export default StartMatchPlayers;