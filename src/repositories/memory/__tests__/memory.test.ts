import { runRepositoryContract } from '../../__tests__/repositoryContract';
import { createMemoryRepositories } from '../index';

runRepositoryContract('memory', () => createMemoryRepositories());
