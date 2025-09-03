import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';

interface Format {
    itag: number;
    quality: string;
    filesize?: number;
    ext: string;
    mimeType: string;
    url: string;
    type: string;
}

interface FormatTableProps {
    formats: Format[];
    kind: 'video' | 'audio';
    onDownload: (format: Format) => void;
}

function humanFileSize(bytes?: number) {
    if (!bytes) return 'Unknown';
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    if (bytes === 0) return '0 B';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i)) + ' ' + sizes[i];
}

const INITIAL_VISIBLE = 5;

const FormatTable: React.FC<FormatTableProps> = ({ formats, kind, onDownload }) => {
    const [showAll, setShowAll] = useState(false);
    const visibleFormats = showAll ? formats : formats.slice(0, INITIAL_VISIBLE);

    return (
        <div className="border rounded-lg overflow-hidden">
            <Table>
                <TableHeader>
                    <TableRow className="bg-gray-50">
                        <TableHead className="font-semibold">Quality</TableHead>
                        <TableHead className="font-semibold">Format</TableHead>
                        <TableHead className="font-semibold">Size</TableHead>
                        <TableHead className="text-right font-semibold">Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {visibleFormats.map((format) => (
                        <TableRow key={format.itag} className="hover:bg-gray-50">
                            <TableCell>
                                <Badge variant="secondary" className="font-medium">
                                    {format.quality}
                                </Badge>
                                {kind === 'video' && format.type === 'video-only' &&
                                    <span className="ml-2 text-xs text-orange-700">(no audio)</span>
                                }
                                {kind === 'video' && format.type === 'combined' &&
                                    <span className="ml-2 text-xs text-green-700">(audio+video)</span>
                                }
                            </TableCell>
                            <TableCell>
                                <span className="text-sm text-gray-600">{format.ext.toUpperCase()}</span>
                            </TableCell>
                            <TableCell>
                                <span className="text-sm text-gray-600">
                                    {humanFileSize(format.filesize)}
                                </span>
                            </TableCell>
                            <TableCell className="text-right">
                                <Button
                                    size="sm"
                                    onClick={() => onDownload(format)}
                                    className="bg-red-500 hover:bg-red-600 text-white"
                                    title={
                                        kind === 'video' && format.type !== 'combined'
                                            ? 'Audio not included. Merge video+audio with advanced tools.'
                                            : 'Download'
                                    }
                                >
                                    <Download size={14} className="mr-1" />
                                    Download
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            {formats.length > INITIAL_VISIBLE && !showAll && (
                <div className="flex justify-center p-4">
                    <Button size="sm" variant="outline" onClick={() => setShowAll(true)}>
                        Show More
                    </Button>
                </div>
            )}
            {formats.length > INITIAL_VISIBLE && showAll && (
                <div className="flex justify-center p-4">
                    <Button size="sm" variant="outline" onClick={() => setShowAll(false)}>
                        Show Less
                    </Button>
                </div>
            )}
        </div>
    );
};

export default FormatTable;
