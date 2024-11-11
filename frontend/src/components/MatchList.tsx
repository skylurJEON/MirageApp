import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { Match } from '../types/match';
import { formatDate } from '../utils/dateUtils';

type MatchListProps = {
  matches: Match[];
  onMatchPress?: (match: Match) => void;
  isLoading: boolean;
  onEndReached?: () => void;
};

export const MatchList = ({
  matches,
  onMatchPress,
  isLoading,
  onEndReached,
}: MatchListProps) => {
  const renderMatch = ({ item }: { item: Match }) => (
    <TouchableOpacity
      style={styles.matchCard}
      onPress={() => onMatchPress?.(item)}
    >
      <View style={styles.matchHeader}>
        <Text style={styles.date}>{formatDate(item.date)}</Text>
        <Text style={styles.league}>
          {item.league?.name || 'Unknown League'}
        </Text>
      </View>
      
      <View style={styles.matchContent}>
        <View style={styles.teamContainer}>
          <Text style={styles.teamName}>
            {item.homeTeam?.team_long_name || 'Home Team'}
          </Text>
          <Text style={styles.score}>{item.home_team_goal || 0}</Text>
        </View>
        
        <View style={styles.separator}>
          <Text style={styles.vs}>vs</Text>
        </View>
        
        <View style={styles.teamContainer}>
          <Text style={styles.score}>{item.away_team_goal || 0}</Text>
          <Text style={styles.teamName}>
            {item.awayTeam?.team_long_name || 'Away Team'}
          </Text>
        </View>
      </View>
      
      <Text style={styles.season}>시즌: {item.season || 'Unknown'}</Text>
    </TouchableOpacity>
  );

  return (
    <FlatList
      data={matches}
      renderItem={renderMatch}
      keyExtractor={(item) => item.id.toString()}
      onEndReached={onEndReached}
      onEndReachedThreshold={0.5}
      ListFooterComponent={
        isLoading ? (
          <View style={styles.loading}>
            <Text style={styles.loadingText}>로딩 중...</Text>
          </View>
        ) : null
      }
    />
  );
};

const styles = StyleSheet.create({
  matchCard: {
    backgroundColor: '#1c1c1e',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  matchHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  date: {
    color: '#8e8e93',
    fontSize: 14,
  },
  league: {
    color: '#8e8e93',
    fontSize: 14,
    fontWeight: '500',
  },
  matchContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  teamContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  teamName: {
    color: '#ffffff',
    fontSize: 16,
    flex: 1,
  },
  score: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: 'bold',
    marginHorizontal: 12,
  },
  separator: {
    paddingHorizontal: 12,
  },
  vs: {
    color: '#8e8e93',
    fontSize: 14,
  },
  season: {
    color: '#8e8e93',
    fontSize: 14,
  },
  loading: {
    padding: 16,
    alignItems: 'center',
  },
  loadingText: {
    color: '#8e8e93',
  },
});