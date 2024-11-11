import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  StyleSheet, 
  ActivityIndicator, 
  Modal,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import SearchButton from '../components/SearchButton';
import { MatchList } from '../components/MatchList';
//import { Match , League} from '../types';
import { fetchMatches } from '../api/matches';
import { MatchResponse, League, Match } from '../types/match';


const TestScreen = () => {
  const [leagues, setLeagues] = useState<League[]>([]);
  const [selectedLeague, setSelectedLeague] = useState<League | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showLeagueModal, setShowLeagueModal] = useState(false);
  const [matches, setMatches] = useState<Match[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [matchError, setMatchError] = useState<string | null>(null);

  const API_URL = 'http://192.168.35.184:3000';

  //const API_URL = 'http://192.0.0.2:3000';
  
  const fetchLeagues = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Fetching leagues from:', `${API_URL}/leagues`);
      
      const response = await fetch(`${API_URL}/leagues`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });
      
      console.log('Response status:', response.status);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Leagues data:', data);
      setLeagues(data);
    } catch (err) {
      console.error('Detailed error:', err);
      setError(`Failed to fetch leagues: ${err}`);
    } finally {
      setLoading(false);
    }
  };

  const loadMatches = async (leagueId?: number, page: number = 1) => {
    try {
      setIsLoading(true);
      setMatchError(null);
      const response = await fetch(
        `${API_URL}/matches/league/${leagueId}?page=${page}&limit=20`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch matches');
      }

      const data = await response.json();
      
      if (page === 1) {
        setMatches(data);
      } else {
        setMatches(prev => [...prev, ...data]);
      }
      
      setHasMore(data.length === 20);
      setCurrentPage(page);
    } catch (error) {
      console.error('Failed to load matches:', error);
      setMatchError('Failed to load matches. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLeagues();
  }, []);

  const handleLeagueSelect = (league: League) => {
    setSelectedLeague(league);
    setShowLeagueModal(false);
    setCurrentPage(1);
    setMatches([]);
    loadMatches(league.id, 1);
  };

  const handleLoadMore = () => {
    if (!isLoading && hasMore) {
      loadMatches(selectedLeague?.id, currentPage + 1);
    }
  };

  const handleMatchPress = (match: Match) => {
    // 매치 상세 정보로 이동하는 로직 구현
    console.log('Match pressed:', match);
  };

  const renderLeague = ({ item }: { item: League }) => (
    <TouchableOpacity 
      style={[
        styles.leagueItem,
        selectedLeague?.id === item.id && styles.selectedLeagueItem
      ]} 
      onPress={() => handleLeagueSelect(item)}
    >
      <Text style={[
        styles.leagueName,
        selectedLeague?.id === item.id && styles.selectedLeagueText
      ]}>
        {item.name}
      </Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#0066cc" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.error}>{error}</Text>
        <TouchableOpacity 
          onPress={fetchLeagues} 
          style={styles.retryButton}
        >
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (matchError) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{matchError}</Text>
        <TouchableOpacity 
          style={styles.retryButton}
          onPress={() => loadMatches(selectedLeague?.id, 1)}
        >
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />
      
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.mainContainer}>
          <View style={styles.topBar}>
            <SearchButton />
            <TouchableOpacity 
              style={styles.leagueSelector} 
              onPress={() => setShowLeagueModal(true)}
            >
              <Text style={styles.leagueSelectorText}>
                {selectedLeague ? selectedLeague.name : '리그 선택'}
              </Text>
              <Text style={styles.dropdownIcon}>▼</Text>
            </TouchableOpacity>
          </View>

          {selectedLeague && (
            <View style={styles.matchListContainer}>
              <MatchList
                matches={matches}
                onMatchPress={handleMatchPress}
                isLoading={isLoading}
                onEndReached={() => {
                  if (!isLoading && hasMore) {
                    loadMatches(selectedLeague.id, currentPage + 1);
                  }
                }}
              />
            </View>
          )}

          {selectedLeague && matches.length === 0 && !loading && (
            <View style={styles.noDataContainer}>
              <Text style={styles.noDataText}>No matches found</Text>
            </View>
          )}
        </View>
      </TouchableWithoutFeedback>

      <Modal
        visible={showLeagueModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowLeagueModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select League</Text>
              <TouchableOpacity 
                onPress={() => setShowLeagueModal(false)}
                style={styles.closeButton}
              >
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
            <FlatList
              data={leagues}
              renderItem={renderLeague}
              keyExtractor={item => item.id.toString()}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.leagueList}
            />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  topBar: {
    flexDirection: 'column',
    alignItems: 'center',
    gap: 18,
    paddingTop: 40,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  leagueSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1c1c1e',
    padding: 12,
    borderRadius: 10,
    width: '100%',
  },
  leagueSelectorText: {
    fontSize: 16,
    color: '#ffffff',
    flex: 1,
  },
  dropdownIcon: {
    fontSize: 16,
    color: '#ffffff',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#1c1c1e',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#2c2c2e',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  closeButton: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  closeButtonText: {
    fontSize: 16,
    color: '#0a84ff',
  },
  leagueItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#2c2c2e',
  },
  leagueName: {
    fontSize: 16,
    color: '#ffffff',
  },
  matchCard: {
    backgroundColor: 'white',
    margin: 8,
    padding: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  date: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
  },
  scoreContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  teamName: {
    flex: 1,
    fontSize: 14,
    color: '#333',
  },
  score: {
    fontSize: 16,
    fontWeight: 'bold',
    marginHorizontal: 8,
  },
  loader: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -25 }, { translateY: -25 }],
  },
  noData: {
    textAlign: 'center',
    marginTop: 24,
    color: '#666',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  error: {
    color: 'red',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 4,
  },
  retryText: {
    color: 'white',
    fontWeight: 'bold',
  },
  selectedLeagueItem: {
    backgroundColor: '#0a84ff',
  },
  selectedLeagueText: {
    color: '#ffffff',
  },
  header: {
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  leagueList: {
    paddingHorizontal: 8,
  },
  selectedLeagueContainer: {
    padding: 16,
    margin: 8,
    backgroundColor: '#1c1c1e',
    borderRadius: 10,
  },
  selectedLeagueTitle: {
    fontSize: 14,
    color: '#8e8e93',
    marginBottom: 4,
  },
  selectedLeagueName: {
    fontSize: 16,
    color: '#ffffff',
    fontWeight: 'bold',
  },
  mainContainer: {
    flex: 1,
  },
  noDataContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noDataText: {
    color: '#666',
    fontSize: 16,
  },
  matchListContainer: {
    flex: 1,
    backgroundColor: '#000000',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
    marginBottom: 16,
  },
});

export default TestScreen;